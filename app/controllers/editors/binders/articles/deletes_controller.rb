class Editors::Binders::Articles::DeletesController < Editors::Binders::ArticlesController
  layout nil

  before_action :set_article, only: [ :show, :destroy ]

  def show
  end

  def destroy
    @article.destroy
    render turbo_stream: turbo_stream.action(:redirect, editors_binder_path(@binder))
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
end
