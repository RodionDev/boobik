class ApplicationController < ActionController::Base
    SITE_NAME = "Etavonni"
    protect_from_forgery with: :exception
end
