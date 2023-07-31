class LandingController < ApplicationController
    def index; end
    def fetch_json
        render :json => { content: render_to_string( 'index', :formats => [:html], :layout => false ), title: 'Welcome', no_banner: true }
    end
end
