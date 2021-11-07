class SessionsController < ApplicationController
    def new; end
    def create
        omniauth = request.env['omniauth.auth']
        info = omniauth['info']['email']
        @auth = Authorization.where( provider: omniauth['provider'], uid: omniauth['uid'] ).first
        if @auth
            user = User.where( id: @auth.user_id ).first
            if user
                session[:user_id] = @auth.user_id
                redirect_to '/'
                flash.now.notice = "Signed in!"
            else
                puts "[FATAL] Failure: While an authorization was found for this provider (#{omniauth['provider']}) and uid, we could not find the referenced Bikboo user account (user_id: #{@auth.user_id}). This indicates an underlying failure with the database, destroying authorization."
                @auth.destroy!
                flash.now.alert = "Unable to sigin. Dwindling authentication methods. Please try again"
            end
        else
            if not verify_google_email
                flash.now.alert = "Failed to signup. Email address (#{omniauth['info']['email']}) has not been verified. Please verify this email on Google and retry"
            elsif User.where( email: omniauth['info']['email'] )
                flash.now.alert = "Unable to sign up; email address is already in use."
            else
                user = User.create( email: omniauth['info']['email'], name: omniauth['info']['name'] )
                if user and not user.new_record?
                    new_auth = Authorization.create( uid: omniauth['uid'], provider: omniauth['provider'], user_id: user.id )
                    if new_auth and not new_auth.new_record?
                        session[:user_id] = new_auth.user_id
                        redirect_to '/'
                        flash.now.notice = "Signed up and logged in. Welcome!"
                    else
                        flash.now.alert = "Failed to signup, server error. Please try again later"
                    end
                else
                    flash.now.alert = "Failed to signup, server error. Please try again later"
                end
            end
        end
    end
    def destroy
        session[:user_id] = nil
        redirect_to '/'
    end
private
    def verify_google_email
        omniauth = request.env['omniauth.auth']
        omniauth['provider'] != 'google' or omniauth['extra']['id_info']['email_verified']
    end
end
