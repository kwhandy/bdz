class Editors::Binders::Articles::SettingsController < Editors::Binders::ArticlesController
  def index
    @binder = Binder.friendly.find(params[:binder_id])
    @article = @binder.articles.friendly.find(params[:article_id])
  rescue ActiveRecord::RecordNotFound
    redirect_to root_path, alert: "Record not found"
  end

  def show
  end
end
