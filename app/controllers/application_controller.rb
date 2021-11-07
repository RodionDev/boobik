class ApplicationController < ActionController::Base
    SITE_NAME = "Bikboo"
    protect_from_forgery with: :exception
private
    def current_user
        @user ||= User.where( id: session[:user_id] ).first if session[:user_id]
    end
    helper_method :current_user
end
