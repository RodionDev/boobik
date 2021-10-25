class ApplicationController < ActionController::Base
    SITE_NAME = "Bikboo"
    protect_from_forgery with: :exception
end
