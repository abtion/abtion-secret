# frozen_string_literal: true

require "rails_helper"
require "tempfile"

RSpec.describe(Api::V1::SecretsController) do
  describe "POST /" do
    describe "key generation" do
      let(:key_length) { Api::V1::SecretsController::KEY_LENGTH }
      let(:colliding_key) { "a" * key_length }
      let(:fresh_key) { "b" * key_length }

      it "regenerates the key when the first candidate already exists in the cache" do
        Rails.cache.write("secret-#{colliding_key}", "occupant")
        allow(SecureRandom).to receive(:urlsafe_base64).and_return(colliding_key, fresh_key)

        Tempfile.create("encrypted-secret") do |file|
          file.write("payload")
          file.close

          post :create, params: { secret: fixture_file_upload(file.path) }
        end

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq(fresh_key)
        expect(SecureRandom).to have_received(:urlsafe_base64).twice
        expect(Rails.cache.read("secret-#{colliding_key}")).to eq("occupant")
      end
    end

    describe "file size limit" do
      let(:max_size) { ENV.fetch("MAX_ENCRYPTED_SECRET_SIZE").to_i }

      before do
        allow(Rails.cache).to receive(:write).and_call_original
      end

      context "when encrypted secret is not too large" do
        it "returns a 200 (Ok)" do
          Tempfile.create("encrypted-secret") do |file|
            file.write("a" * max_size)
            file.close

            post :create, params: { secret: fixture_file_upload(file.path) }
          end

          expect(response).to have_http_status(:ok)
          expect(Rails.cache).to have_received(:write)
        end
      end

      context "when encrypted secret is too large" do
        it "returns a 413 (Payload Too Large)" do
          Tempfile.create("encrypted-secret") do |file|
            file.write("a" * (max_size + 1))
            file.close

            post :create, params: { secret: fixture_file_upload(file.path) }
          end

          expect(response).to have_http_status(:content_too_large)
          expect(response.body).to eq("Secret too large")
          expect(Rails.cache).not_to have_received(:write)
        end
      end
    end

    describe "lifetime" do
      let(:max_days) { ENV.fetch("MAX_SECRET_LIFETIME_DAYS").to_i }
      let(:secret_file) do
        file = Tempfile.new("encrypted-secret")
        file.write("a")
        file.close
        file
      end

      before do
        allow(Rails.cache).to receive(:write).and_call_original
      end

      context "when lifetime_days is omitted" do
        it "stores the secret with a 1-day TTL" do
          post :create, params: { secret: fixture_file_upload(secret_file.path) }

          expect(response).to have_http_status(:ok)
          expect(Rails.cache).to have_received(:write).with(
            anything, anything, expires_in: 1 * 24 * 3600
          )
        end
      end

      context "when lifetime_days is within range" do
        it "stores the secret with the requested TTL" do
          post :create, params: {
            secret: fixture_file_upload(secret_file.path),
            lifetime_days: 7
          }

          expect(response).to have_http_status(:ok)
          expect(Rails.cache).to have_received(:write).with(
            anything, anything, expires_in: 7 * 24 * 3600
          )
        end
      end

      context "when lifetime_days is zero" do
        it "returns 422 and does not store the secret" do
          post :create, params: {
            secret: fixture_file_upload(secret_file.path),
            lifetime_days: 0
          }

          expect(response).to have_http_status(:unprocessable_content)
          expect(response.body).to eq("Invalid lifetime")
          expect(Rails.cache).not_to have_received(:write)
        end
      end

      context "when lifetime_days exceeds the configured maximum" do
        it "returns 422 and does not store the secret" do
          post :create, params: {
            secret: fixture_file_upload(secret_file.path),
            lifetime_days: max_days + 1
          }

          expect(response).to have_http_status(:unprocessable_content)
          expect(response.body).to eq("Invalid lifetime")
          expect(Rails.cache).not_to have_received(:write)
        end
      end

      context "when lifetime_days is non-numeric" do
        it "returns 422 and does not store the secret" do
          post :create, params: {
            secret: fixture_file_upload(secret_file.path),
            lifetime_days: "abc"
          }

          expect(response).to have_http_status(:unprocessable_content)
          expect(Rails.cache).not_to have_received(:write)
        end
      end
    end
  end

  describe "GET /:id" do
    describe "secret lifetime" do
      include ActiveSupport::Testing::TimeHelpers

      let(:lifetime_seconds) { Api::V1::SecretsController::SECRET_LIFETIME_SECONDS }
      let(:key) { "test-key" }
      let(:payload) { "encrypted-payload-bytes" }

      it "returns the secret while still within its lifetime" do
        freeze_time do
          Rails.cache.write("secret-#{key}", payload, expires_in: lifetime_seconds)
          travel(lifetime_seconds - 1.second)
          get :show, params: { id: key }
          expect(response.body).to eq(payload)
        end
      end

      it "returns an empty body once the lifetime has elapsed" do
        freeze_time do
          Rails.cache.write("secret-#{key}", payload, expires_in: lifetime_seconds)
          travel(lifetime_seconds + 1.second)
          get :show, params: { id: key }
          expect(response.body).to be_empty
        end
      end
    end
  end
end
