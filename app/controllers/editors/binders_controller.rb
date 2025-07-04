class Editors::BindersController < EditorsController
  layout 'binder', only: :show

  def index
    @pagy, @binders = pagy(Binder.all.order(created_at: :desc), items: 5)

    respond_to do |format|
      format.turbo_stream
    end
  end

  def show
    @binder = Binder.friendly.find(params[:id])
  end

  def new
    @binder = Binder.new
  end

  def create
    @binder = Binder.new(binder_params)
    
    respond_to do |format|
      if @binder.save
        format.turbo_stream { flash.now[:notice] = "Binder successfully created!" }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace("enbf", partial: "editors/binders/form") }
      end
    end
  end

  private
    def binder_params
      params.expect(binder: [:title, :description])
    end
end
