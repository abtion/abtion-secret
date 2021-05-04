# frozen_string_literal: true

require "constraints/api_version"

Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    scope module: :v1, constraints: Constraints::ApiVersion.new("v1") do
      resources :secrets, only: [:create, :show]
    end
  end

  root to: "secrets#new"
  match "*key", to: "secrets#show", via: :all
end
