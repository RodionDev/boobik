class UsersController < ApplicationController
    before_action :require_login
    def show; end
    def show_new; end
end
