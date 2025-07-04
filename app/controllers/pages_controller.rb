class PagesController < ApplicationController
  def index
    @binder = Binder.first
  end
end
