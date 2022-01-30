class UsersController < ApplicationController
    before_action do require_login to_access: "/dashboard" end
    def show; end
end
