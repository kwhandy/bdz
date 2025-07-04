class Editors::Binders::VisiblesController < Editors::BindersController
  layout nil
  before_action :set_binder, only: [ :edit, :update ]

  def edit
    sleep 2
  end

  def update
    if @binder.update(visible_params)
      render json: { status: 'success' }
    else
      render json: { errors: @binder.errors }, status: :unprocessable_entity
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

    def visible_params
      params.expect(binder: :status)
    end
end
