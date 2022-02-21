class ApplicationController < ActionController::Base
    SITE_NAME = "Bikboo"
    protect_from_forgery with: :exception
    before_action :validate_session
private
    def require_login(to_access: false)
        to_access ||= request.fullpath
        unless current_user
            redirect_to( to_access ? "/?continue=#{to_access}" : "/", alert: "You must be logged in to access this page. Please sign in with Google." )
        end
    end
    def url_absolute?(url)
        if block_given?
            yield url, ( /^https?:\/\//i.match? url ) ? url : false
        else
            /^https?:\/\//i.match? ( url )
        end
    end
    def current_user
        @user ||= User.find session[:user_id] if session[:user_id]
    end
    def validate_session
        user_id = session[:user_id]
        auth_token = session[:auth_token]
        if user_id and auth_token
            user = User.find_by_id user_id
            unless user and user.auth_token == auth_token
                reset_session
                redirect_to '/', alert: "Session invalidated; your user has been logged out of all devices. Please log in again."
            end
        elsif user_id or auth_token
            reset_session
        end
    end
    helper_method :current_user, :url_absolute?
end
