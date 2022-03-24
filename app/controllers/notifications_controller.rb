class NotificationsController < ApplicationController
    before_action :require_login
    def index
        render :json => current_user.notifications, status: :ok
    end
    def update
    end
    def destroy
        notification = Notification.find params[:id]
        if notification.user_id != current_user.id then
            render :json => { error: "Unauthorized request. Notification with ID #{params[:id]} is not attached to this user" }, status: :unauthorized
        else
            begin
                notification.destroy!
            rescue ActiveRecord::RecordNotDestroyed
                render :json => { error: "Unable to destroy notification. ActiveRecord::RecordNotDestroyed caught during destruction"}, status: :internal_server_error
            else
                render :json => { info: "Notification destroyed" }, status: :ok
            end
        end
    rescue ActiveRecord::RecordNotFound
        render :json => { error: "Invalid request. Notification with ID #{params[:id]} not found" }, status: :bad_request
    end
private
    def require_login
        unless current_user
            render :json => { error: "Unauthorized request" }, status: :unauthorized
        end
    end
end
