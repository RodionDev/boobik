class ProjectsController < ApplicationController
    before_action :require_login
    layout 'users'
    def index
        redirect_to '/dashboard'
    end
    def show
        @project = Project.find params[:id]
    end
    def new
        @project = Project.new
    end
    def create
        respond_to do |format|
            format.html { redirect_to '/dashboard', alert: "Project creation is currently down for maintainence. Please check back later." }
            format.json { render :json => { error: "Project creation is currently down for maintainence. Please check back later." }, status: :internal_server_error }
        end
    end
end
