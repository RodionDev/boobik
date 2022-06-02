Rails.application.routes.draw do
    get '/auth/google/callback', to: 'sessions#create'
    get '/auth/failure', to: 'sessions#failure'
    get '/signin', to: redirect( path: '/auth/google' )
    get '/signout', to: 'sessions#destroy'
    get '/dashboard', to: 'users#show'
    get '/new-dashboard', to: 'users#show_new'
    resources :projects
    resources :notifications, only: [:index, :update, :destroy]
    get 'notifications/recent', to: 'notifications#recent'
    scope :api do
        resources :notifications, only: [:index, :update, :destroy]
        get 'notifications/recent', to: 'notifications#recent'
    end
    root 'landing#index'
end
