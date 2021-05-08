# frozen_string_literal: true

require "securerandom"

module Api
  module V1
    class SecretsController < ApplicationController
      RESPONSE_TIME = ENV.fetch("API_RESPONSE_TIME_SECONDS").to_f
      KEY_LENGTH = ENV.fetch("KEY_LENGTH").to_i
      MAX_ENCRYPTED_SECRET_SIZE = ENV.fetch("MAX_ENCRYPTED_SECRET_SIZE").to_i
      SECRET_LIFETIME_SECONDS = ENV.fetch("SECRET_LIFETIME_HOURS").to_i * 1 * 3600

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
          if params[:secret].size > MAX_ENCRYPTED_SECRET_SIZE
            render plain: "Secret too large", layout: false, status: :payload_too_large
            return
          end

          key = unused_key
          Rails.cache.write(prefixed_key(key),
                            params[:secret].read, expires_in: SECRET_LIFETIME_SECONDS)

          render json: key.to_json
        end
      end

      private

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
