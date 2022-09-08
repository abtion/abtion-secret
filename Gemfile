# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.7.4"

gem "pry"
gem "puma", "~> 5.6"
gem "rack-attack"
gem "rails", "~> 7.0.3", require: false
gem "redis"
gem "shakapacker", "6.5.2"
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

group :development, :test do
  gem "brakeman"
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "dotenv-rails"
  gem "erb_lint", require: false
  gem "rspec-rails", "~> 5.1"
  gem "rubocop"
  gem "rubocop-performance"
  gem "rubocop-rails"
  gem "rubocop-rspec"
  gem "selenium-webdriver"
  gem "webdrivers", "~> 5.0", require: false
end

group :development do
  gem "listen", "~> 3.7"
  gem "pivotal_git_scripts"
  gem "rack-mini-profiler", "~> 3.0"
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "capybara-screenshot"
  gem "simplecov"
end
