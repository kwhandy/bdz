class Editors::Binders::ArticlesController < Editors::BindersController
  layout 'article'

  before_action :set_binder
  before_action :set_article, only: [ :edit, :update ]


  def index
    @pagy, @articles = pagy(@binder.articles.order(created_at: :desc), items: 5)

    respond_to do |format|
      format.turbo_stream
    end
  end

  def create
    @binder = Binder.friendly.find(params[:binder_id])
    @article = @binder.articles.create
    
    sleep 1

    render turbo_stream: [ 
      turbo_stream.action(:redirect, edit_editors_binder_article_path(@binder, @article))
    ]
  end

  def edit
    # show form with markdown preview
    # ENABLE TEXTAREA UPLOAD https://www.youtube.com/watch?v=rOdtvShwFPE
    # ENABLE AUTOSAVE https://www.youtube.com/watch?v=K0xDJPFSoug
  end

  def update
    # sleep 1
    # Rails.logger.debug "Params received: #{params.inspect}"

    if @article.update(article_params)
      @article.drafted!
      
      render json: { 
        status: 'success',
        sync_time: @article.content_sync_time.iso8601,
        visibility: @article.status
      }
    else
      render json: { errors: @article.errors }, status: :unprocessable_entity
    end
  end

  private
    def handle_not_found
      redirect_to root_path, alert: "Record not found"
    end

    def set_binder
      @binder = Binder.friendly.find(params[:binder_id])
    rescue ActiveRecord::RecordNotFound
      handle_not_found
    end

    def set_article
      @article = @binder.articles.friendly.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      handle_not_found
    end

    def article_params
      params.expect(article: :content)
    end  
end
