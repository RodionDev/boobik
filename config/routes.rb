Rails.application.routes.draw do
  get 'welcome/index'
  get 'index', controller: :welcome
  root "welcome#index"
  resources :articles do
  	resources :comments
  end
end
