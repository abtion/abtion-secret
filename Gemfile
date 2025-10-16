# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby file: ".tool-versions"

gem "pry"
gem "puma", "~> 7.0"
gem "rack-attack"
gem "rails", "~> 8.0.2"
gem "redis"
gem "shakapacker", "8.4.0"
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

group :development, :test do
  gem "brakeman"
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "dotenv-rails"
  gem "erb_lint", require: false
  gem "rspec-rails", "~> 8.0"
  gem "rubocop"
  gem "rubocop-performance"
  gem "rubocop-rails"
  gem "rubocop-rspec"
  gem "selenium-webdriver", ">= 4.11"
end

group :development do
  gem "pivotal_git_scripts"
  gem "rack-mini-profiler", "~> 4.0"
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "simplecov"
end
