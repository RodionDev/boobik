class LandingController < ApplicationController
    def index; end
    def fetch_json
        render :json => { content: render_to_string( 'index', :formats => [:html], :layout => false ), title: request.path }
    end
end
