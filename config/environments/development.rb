# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Make code changes take effect immediately without server restart.
  config.enable_reloading = true

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # The application's main DB is the cache store, so we need it to be available in development
  config.cache_store = :redis_cache_store,
                       { url: ENV.fetch("REDIS_URL"),
                         ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE } }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Make it possible to run the dev-server under other host names than "localhost".
  # For example in `.env.development.local`:
  #
  # ALLOWED_HOSTS=dev-server,xxx.ngrok.io
  config.hosts += ENV.fetch("ALLOWED_HOSTS", "").split(",")

  # Annotate rendered view with file names.
  config.action_view.annotate_rendered_view_with_filenames = true

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true
end
