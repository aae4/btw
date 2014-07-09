class MimsController < ApplicationController
	before_filter :authenticate_user!

  def index
  	@mims = Mim.all
  end

  def new
  	@mim = Mim.new
  end

  def create
  	@mim = Mim.new(mim_params)
  	@mim.user = current_user
    if @mim.save
      flash[:notice] = "Successfully created mim."
      redirect_to @mim
    else
      render :action => 'new'
    end
  end

  def update
    @mim = Mim.find(params[:id])
    if @mim.update_attributes(mim_params)
      flash[:notice] = "Successfully updated mim."
      redirect_to @mim
    else
      render :action => 'edit'
    end
  end

  def edit
  	@mim = Mim.find(params[:id])
  end

  def show
  	@mim = Mim.find(params[:id])
  end

  private
    def mim_params
      params.require(:mim).permit(:id, :description_markdown, :description_html, :user_id)
    end
end
