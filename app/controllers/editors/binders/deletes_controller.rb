class Editors::Binders::DeletesController < Editors::BindersController
  before_action :set_binder, only: [ :show, :destroy ]

  def show
  end

  def destroy
    @binder.destroy
    render turbo_stream: turbo_stream.action(:redirect, editors_path)
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
end
