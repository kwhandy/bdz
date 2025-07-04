class Editors::Binders::SettingsController < Editors::BindersController
  layout 'binder', only: :index

  def index
    @binder = Binder.friendly.find(params[:binder_id])
  rescue ActiveRecord::RecordNotFound
    redirect_to root_path, alert: "Record not found"
  end

  def show
  end
end
