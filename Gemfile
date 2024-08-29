# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.2"

gem "pry"
gem "puma", "~> 6.4"
gem "rack-attack"
gem "rails", "~> 7.2.0", require: false
gem "redis"
gem "shakapacker", "8.0.2"
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

group :development, :test do
  gem "brakeman"
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "dotenv-rails"
  gem "erb_lint", require: false
  gem "rspec-rails", "~> 6.1"
  gem "rubocop"
  gem "rubocop-performance"
  gem "rubocop-rails"
  gem "rubocop-rspec"
  gem "selenium-webdriver", ">= 4.11"
end

group :development do
  gem "listen", "~> 3.9"
  gem "pivotal_git_scripts"
  gem "rack-mini-profiler", "~> 3.3"
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "simplecov"
end
