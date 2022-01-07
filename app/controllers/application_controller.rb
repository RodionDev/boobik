class ApplicationController < ActionController::Base
    SITE_NAME = "Bikboo"
    protect_from_forgery with: :exception
private
    def require_login(to_access: false)
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
        @user ||= User.where( id: session[:user_id] ).first if session[:user_id]
    end
    helper_method :current_user, :url_absolute?
end
