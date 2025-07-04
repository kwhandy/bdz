class Editors::Binders::Articles::FilenamesController < Editors::Binders::ArticlesController
  layout nil

  before_action :set_article, only: [ :edit, :update ]

  def edit
  end

  def update
    if @article.update(filename_params)
      render json: { status: 'success' }
    else
      render json: { errors: @article.errors }, status: :unprocessable_entity
    end
  end

  private
    def handle_not_found
      redirect_to root_path, alert: "Record not found"
    end
  
    def set_article
      @binder = Binder.friendly.find(params[:binder_id])
      @article = @binder.articles.friendly.find(params[:article_id])
    rescue ActiveRecord::RecordNotFound
      handle_not_found
    end

    def filename_params
      params.expect(
        article: [
          :title,
          :subtitle
        ]
      )
    end
end
