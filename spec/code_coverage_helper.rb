# frozen_string_literal: true

require "simplecov"
require "simplecov_json_formatter"

unless ENV.key?("DISABLE_SIMPLECOV")
  SimpleCov.start("rails") do
    formatter SimpleCov::Formatter::MultiFormatter.new([
      SimpleCov::Formatter::HTMLFormatter,
      SimpleCov::Formatter::JSONFormatter
    ])
    add_filter "spec"
    add_filter "vendor"
    minimum_coverage(ENV.fetch("CODE_COVERAGE_PERCENTAGE", 0).to_i)
  end
end
