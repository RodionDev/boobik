Rails.application.routes.draw do
    get '/auth/google/callback', to: 'sessions#create'
    get '/auth/failure', to: 'sessions#failure'
    get '/signin', to: redirect( path: '/auth/google' )
    get '/signout', to: 'sessions#destroy'
    get '/dashboard', to: 'projects#index'
    get '/dashboard/project/:id', to: 'projects#index'
    scope :api do
        get '/projects/metadata', to: 'projects#get_metadata'
        get 'index.json', to: 'landing#fetch_json'
        resources :projects
    end
    root 'landing#index'
end
