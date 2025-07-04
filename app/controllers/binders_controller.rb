class BindersController < ApplicationController
  def index
  end

  def show
    @binder = Binder.friendly.find(params[:id])
  end
end
