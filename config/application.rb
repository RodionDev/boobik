require_relative 'boot'
require 'rails/all'
Bundler.require(*Rails.groups)
module Bikboo
  class Application < Rails::Application
    config.load_defaults 5.1
    config.sass.preferred_syntax = :sass
    config.middleware.use Rack::ContentLength
  end
end
