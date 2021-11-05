Rails.application.routes.draw do
    get '/auth', to: redirect('/auth/google'), as: 'signin'
    get '/auth/google/callback', to: 'sessions#create'
    get '/auth/failure', to: 'sessions#failure'
    get '/signout', to: 'sessions#destroy', as: 'signout'
    root 'landing#index'
end
