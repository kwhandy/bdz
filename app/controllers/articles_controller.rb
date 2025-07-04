class ArticlesController < ApplicationController
  # layout "article", only: [:show]

  def index
    if params[:binder_id].present?
      @binder = Binder.friendly.find(params[:binder_id])
      @pagy, @articles = pagy(@binder.articles.order(created_at: :desc), items: 5)

      render :index, formats: :turbo_stream
    else
      render plain: "Not Found", status: :not_found, formats: :html
    end
  end

  def show
    @article = Article.friendly.find(params[:id])
    
    respond_to do |format|
      # format.html { render layout: "article" }
      format.html

      format.json do
        sleep 2
        content = @article.content || ""
        if params[:raw_key] == @article.raw_key
          render json: { content: content }
        else
          render json: { error: "Action Unauthorized: Invalid Query Key" }, status: :unauthorized
        end
      end
    end

    
  end
end
