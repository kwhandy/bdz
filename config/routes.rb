Rails.application.routes.draw do



  # resources :binders, path: "rl", only: [:index, :show]

  resources :articles, path: "a", only: [:index, :show]

  namespace :editors, path: "editor" do
    resources :binders, path: "binder", only: [ :index, :show, :new, :create ] do
      scope module: 'binders' do
        resources :articles, only: [ :index, :show, :new, :create, :edit, :update ] do
          scope module: 'articles' do
            resource :delete, only: [ :show, :destroy ]
            resource :filename, only: [ :edit, :update ]
            resource :visible, only: [ :edit, :update ]

            resources :settings, only: :index
          end
        end
        resource :delete, only: [ :show, :destroy ]
        resource :title, only: [ :edit, :update ]
        resource :visible, only: [ :edit, :update ]

        resources :settings, only: :index
      end
    end
  end

  resources :editors, path: "editor", only: [:index]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "pages#index"
end
