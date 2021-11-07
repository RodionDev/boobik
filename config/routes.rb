Rails.application.routes.draw do
    get '/auth/google/callback', to: 'sessions#create'
    get '/auth/failure', to: 'sessions#failure'
    get '/signin', to: redirect('/auth/google')
    get '/signout', to: 'sessions#destroy'
    root 'landing#index'
end
