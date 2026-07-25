# frozen_string_literal: true

require "securerandom"

module Api
  module V1
    class SecretsController < ApplicationController
      RESPONSE_TIME = ENV.fetch("API_RESPONSE_TIME_SECONDS").to_f
      KEY_LENGTH = ENV.fetch("KEY_LENGTH").to_i
      MAX_ENCRYPTED_SECRET_SIZE = ENV.fetch("MAX_ENCRYPTED_SECRET_SIZE").to_i
      MAX_SECRET_LIFETIME_DAYS = ENV.fetch("MAX_SECRET_LIFETIME_DAYS").to_i
      DEFAULT_SECRET_LIFETIME_DAYS = 1

      def show
        ensure_response_time(RESPONSE_TIME) do
          key = params[:id]
          secret = Rails.cache.read(prefixed_key(key))

          Rails.cache.delete(prefixed_key(key)) if secret.present?
          send_data(secret)
        end
      end

      def create
        ensure_response_time(RESPONSE_TIME) do
          if oversized_secret?
            render plain: "Secret too large", layout: false, status: :content_too_large
          elsif invalid_lifetime?
            render plain: "Invalid lifetime", layout: false, status: :unprocessable_content
          else
            store_secret_and_render_key
          end
        end
      end

      private

      def oversized_secret?
        params[:secret].size > MAX_ENCRYPTED_SECRET_SIZE
      end

      def invalid_lifetime?
        !lifetime_days.between?(1, MAX_SECRET_LIFETIME_DAYS)
      end

      def lifetime_days
        @lifetime_days ||=
          (params[:lifetime_days].presence || DEFAULT_SECRET_LIFETIME_DAYS).to_i
      end

      def store_secret_and_render_key
        key = unused_key
        Rails.cache.write(prefixed_key(key),
                          params[:secret].read, expires_in: lifetime_days * 24 * 3600)
        render json: key.to_json
      end

      def unused_key
        key = nil
        loop do
          key = SecureRandom.urlsafe_base64(KEY_LENGTH)[0...KEY_LENGTH]
          break unless Rails.cache.exist?(prefixed_key(key))
        end

        key
      end

      def prefixed_key(key)
        "secret-#{key}"
      end

      def ensure_response_time(seconds)
        thr = Thread.new do
          sleep(seconds)
        end

        result = yield

        thr.join

        result
      end
    end
  end
end
