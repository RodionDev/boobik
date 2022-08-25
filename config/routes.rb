Rails.application.routes.draw do
    get '/auth/google/callback', to: 'sessions#create'
    get '/auth/failure', to: 'sessions#failure'
    get '/signin', to: redirect( path: '/auth/google' )
    get '/signout', to: 'sessions#destroy'
    get '/dashboard', to: 'projects#index'
    get '/dashboard/project/:id', to: 'projects#index'
    scope :api do
        get 'index.json', to: 'landing#fetch_json'
        get 'dashboard.json', to: 'projects#index'
        resources :projects
    end
    root 'landing#index'
end
