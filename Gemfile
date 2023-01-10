# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.7.4"

gem "pry"
gem "puma", "~> 6.0"
gem "rack-attack"
gem "rails", "~> 7.0.4", require: false
gem "redis"
gem "shakapacker", "6.5.5"
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

group :development, :test do
  gem "brakeman"
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "dotenv-rails"
  gem "erb_lint", require: false
  gem "rspec-rails", "~> 6.0"
  gem "rubocop"
  gem "rubocop-performance"
  gem "rubocop-rails"
  gem "rubocop-rspec"
  gem "selenium-webdriver"
  gem "webdrivers", "~> 5.2", require: false
end

group :development do
  gem "listen", "~> 3.8"
  gem "pivotal_git_scripts"
  gem "rack-mini-profiler", "~> 3.0"
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "capybara-screenshot"
  gem "simplecov"
end
