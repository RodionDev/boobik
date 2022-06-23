Rails.application.routes.draw do
    get '/auth/google/callback', to: 'sessions#create'
    get '/auth/failure', to: 'sessions#failure'
    get '/signin', to: redirect( path: '/auth/google' )
    get '/signout', to: 'sessions#destroy'
    get '/dashboard', to: 'users#show'
    get '/new-dashboard', to: 'users#show_new'
    scope :api do
        get '/projects/metadata', to: 'projects#get_metadata'
        resources :projects
    end
    get '/projects', to: redirect( path: '/dashboard' )
    root 'landing#index'
end
