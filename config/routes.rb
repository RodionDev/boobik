Rails.application.routes.draw do
    get '/auth/google/callback', to: 'sessions#create'
    get '/auth/failure', to: 'sessions#failure'
    get '/signin', to: redirect( path: '/auth/google' )
    get '/signout', to: 'sessions#destroy'
    get '/dashboard', to: 'projects#index'
    get '/dashboard/project/:id', to: 'projects#index'
    get '/api/projects', to: redirect( path: '/dashboard' )
    scope :api do
        get '/projects/metadata', to: 'projects#get_metadata'
        resources :projects
    end
    root 'landing#index'
end
