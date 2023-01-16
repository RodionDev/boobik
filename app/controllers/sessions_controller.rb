class SessionsController < ApplicationController
    def create
        omniauth = request.env['omniauth.auth']
        info = omniauth['info']
        continue_url = request.env['omniauth.params']['continue']
        redirect_path = (url_absolute? continue_url) ? '/' : ( continue_url or "/" )
        provider = omniauth['provider']
        uid = omniauth['uid']
        @auth = Authorization.find_by_provider_and_uid provider, uid
        if @auth
            begin
                user = User.find @auth.user_id
                signin_user user
                flash.notice = "Signed in!"
            rescue ActiveRecord::RecordNotFound
                @auth.destroy!
                flash.alert = "Unable to sign in. Authorization points to missing user account. Please try again now that dwindling authentications have been destroyed."
            end
        else
            if not verify_google_email
                flash.alert = "Failed to sign up. Email address (#{info['email']}) has not been verified. Please verify this email on Google and retry"
            elsif User.find_by_email info['email']
                flash.alert = "Unable to sign up; email address is already in use."
            else
                user = User.create( email: info['email'], name: info['name'], image_url: info['image'] )
                if user and not user.new_record?
                    new_auth = Authorization.create( uid: uid, provider: provider, user_id: user.id )
                    if new_auth and not new_auth.new_record?
                        signin_user user
                        flash.notice = "Signed up and logged in. Welcome!"
                    else
                        flash.alert = "Failed to signup, server error. Please try again later"
                    end
                else
                    flash.alert = "Failed to signup, server error. Please try again later"
                end
            end
        end
        redirect_to flash.alert ? root_url : redirect_path
    end
    def destroy
        if params[:revoke] then
            logger.warn "Session destruction confirmed; authentication token regenerated."
            current_user.generate_auth_token
            destroy_session true
        else
            destroy_session
        end
        redirect_to '/', notice: 'Signed out'
    end
private
    def verify_google_email
        omniauth = request.env['omniauth.auth']
        omniauth['provider'] != 'google' or omniauth['extra']['id_info']['email_verified']
    end
    def signin_user( user )
        raise "Invalid arguments passed. Expected 'user' model instance. Refusing to sign in user." unless user
        user.generate_auth_token unless user.auth_token
        reset_session
        session[:auth_token] = user.auth_token
        session[:user_id] = user.id
        cookies.encrypted[:user_id] = user.id
        cookies.encrypted[:auth_token] = user.auth_token
    end
end
