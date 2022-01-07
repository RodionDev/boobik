class SessionsController < ApplicationController
    def new; end
    def create
        omniauth = request.env['omniauth.auth']
        info = omniauth['info']['email']
        continue_url = request.env['omniauth.params']['continue']
        redirect_path = (url_absolute? continue_url) ? '/' : ( continue_url or "/" )
        @auth = Authorization.where( provider: omniauth['provider'], uid: omniauth['uid'] ).first
        if @auth
            user = User.where( id: @auth.user_id ).first
            if user
                session[:user_id] = @auth.user_id
                flash.notice = "Signed in!"
            else
                @auth.destroy!
                flash.alert = "Unable to sigin. Dwindling authentication methods. Please try again"
            end
        else
            if not verify_google_email
                flash.alert = "Failed to signup. Email address (#{omniauth['info']['email']}) has not been verified. Please verify this email on Google and retry"
            elsif User.where( email: omniauth['info']['email'] ).first
                flash.alert = "Unable to sign up; email address is already in use."
            else
                user = User.create( email: omniauth['info']['email'], name: omniauth['info']['name'] )
                if user and not user.new_record?
                    new_auth = Authorization.create( uid: omniauth['uid'], provider: omniauth['provider'], user_id: user.id )
                    if new_auth and not new_auth.new_record?
                        session[:user_id] = new_auth.user_id
                        flash.notice = "Signed up and logged in. Welcome!"
                    else
                        flash.alert = "Failed to signup, server error. Please try again later"
                    end
                else
                    flash.alert = "Failed to signup, server error. Please try again later"
                end
            end
        end
        redirect_to redirect_path
    end
    def destroy
        session[:user_id] = nil
        redirect_to '/', notice: 'Signed out'
    end
private
    def verify_google_email
        omniauth = request.env['omniauth.auth']
        omniauth['provider'] != 'google' or omniauth['extra']['id_info']['email_verified']
    end
end
