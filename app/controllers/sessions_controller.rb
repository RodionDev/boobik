class SessionsController < ApplicationController
    def create
        render plain: request.env["omniauth.auth"].to_yaml
    end
end
