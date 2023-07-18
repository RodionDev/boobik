include ActionView::Helpers::DateHelper
class ProjectsController < ApplicationController
    before_action :require_login
    def index
        respond_to do |format|
            format.html
            format.json do
                render :json => {
                    content: render_to_string( :layout => false, :formats => [:html] ),
                    title: 'Dashboard',
                    sub_title: 'Dashboard',
                    banner_link: '<a href="/dashboard/create" class="new" title="Create project"><span>Create</span></a>'
                }
            end
        end
    end
    def show
        @project = Project.find_by_id( params[:id] )
        auth = ( @project && @project.user_id ) == current_user.id
        if @project then
            respond_to do |format|
                format.html
                format.json do
                    render :json => {
                        content: render_to_string( :layout => false, :formats => [:html] ),
                        title: 'Project Information',
                        sub_title: auth ? ( ( @project && @project.title ) || 'Unnamed Project' ) : false,
                        breadcrumbs: [
                            [ "Dashboard", "/dashboard" ]
                        ]
                    }
                end
            end
        else
            render :json => {content: "Project not found"}, status: :not_found
        end
    end
    def new
        logger.info "Rending new project form"
        @project = Project.new
        respond_to do |format|
            format.html
            format.json do
                render :json => {
                    content: render_to_string( :layout => false, :formats => [:html] ),
                    title: 'New Project',
                    sub_title: 'New Project',
                    breadcrumbs: [
                        [ "Dashboard", "/dashboard" ]
                    ]
                }
            end
        end
    end
    def create
        title_field = ( params[:title] and !params[:title].empty? )
        terms_field = ( params[:tos] and params[:tos] == "on" )
        if not ( title_field and terms_field )
            render :json => { error: "Failed to create project, required fields not filled", field_error: true, fields: { :title => title_field, :tos => terms_field } }, status: :internal_server_error
        else
            begin
                project = Project.create!(user_id: session[:user_id], title: params[:title].truncate( 25, :omission => ''), desc: params[:desc].truncate( 250, :omission => "... (truncated)" ))
                if project and not project.new_record?
                    render :json => { notice: "Project created!", project_id: project.id }, status: :ok
                else
                    render :json => { error: "Failed to create project. Server error occurred. Please try again later" }, status: :internal_server_error
                end
            rescue ActiveRecord::InvalidRecord
                render :json => { error: "Failed to create project, validation failed." }, status: :internal_server_error
            end
        end
    end
    def get_metadata
        payload = { project_count: current_user.projects.count, projects: [] }
        projects = payload[:projects]
        current_user.projects.order('updated_at DESC').each do |project|
            projectJSON = project.as_json
            projectJSON[:slide_count] = project.project_slides.count
            projectJSON[:formatted_updated_at] = time_ago_in_words(project.updated_at)
            projects.push( projectJSON )
        end
        render :json => payload
    end
    def get_project_information()
        project = Project.find params[:id]
        if( ( project && project.user_id ) == current_user.id ) then
            render :json => project.as_json.merge({:slides => project.project_slides, :statusInfo => ""})
        else
            render :json => {
                :message => "Unable to retrieve project information; user not authorized"
            }, status: :unauthorized
        end
    end
private
    def construct_payload
        return current_user.projects
    end
end
