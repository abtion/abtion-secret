# frozen_string_literal: true

require "capybara/rspec"

# Default driver registrations
# https://github.com/teamcapybara/capybara/blob/master/lib/capybara/registrations/drivers.rb

Capybara.configure do |config|
  config.server_port = 9887 + ENV["TEST_ENV_NUMBER"].to_i
  config.default_max_wait_time = 5
end

# Rails doesn't respect the driver settings provided directly to capybara:
# https://github.com/rails/rails/issues/34379
#
# So we set it the rails way instead of the capybara way
RSpec.configure do |config|
  config.before(:each, type: :system) do
    driven_by(:selenium, using: ENV.fetch("CAPYBARA_DRIVER", "headless_chrome").to_sym,
                         screen_size: [1920, 1080]) do |capabilities|
      # Until this is released:
      #   https://github.com/SeleniumHQ/selenium/pull/13271
      # Use the recommended workaround:
      #   https://github.com/SeleniumHQ/selenium/pull/13271#issuecomment-1854042830
      capabilities.add_argument("--headless=new") if capabilities.args.delete("--headless")
    end
  end
end
