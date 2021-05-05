# frozen_string_literal: true

require "securerandom"

module Api
  module V1
    class SecretsController < ApplicationController
      RESPONSE_TIME = 0.1
      KEY_LENGTH = 16
      SECRET_LIFETIME = 3600 * 24 * 1

      def show
        ensure_response_time(RESPONSE_TIME) do
          secret = Rails.cache.read(params[:id])

          Rails.cache.delete(params[:id]) if secret.present?
          send_data(secret)
        end
      end

      def create
        ensure_response_time(RESPONSE_TIME) do
          key = unused_key
          Rails.cache.write(key, params[:secret].read, expires_in: SECRET_LIFETIME)

          render json: key.to_json
        end
      end

      private

      def unused_key
        key = nil
        loop do
          key = SecureRandom.hex(KEY_LENGTH / 2)
          break unless Rails.cache.exist?(key)
        end

        key
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
