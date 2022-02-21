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
        redirect_to '/dashboard', alert: "Project creation is currently down for maintainence. Please check back later."
    end
end
