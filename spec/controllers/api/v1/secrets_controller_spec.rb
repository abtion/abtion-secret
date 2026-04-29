# frozen_string_literal: true

require "rails_helper"
require "tempfile"

RSpec.describe(Api::V1::SecretsController) do
  describe "POST /" do
    describe "file size limit" do
      let(:max_size) { ENV.fetch("MAX_ENCRYPTED_SECRET_SIZE").to_i }

      before do
        allow(Rails.cache).to receive(:write).and_call_original
      end

      context "when encrypted secret is not too large" do
        it "returns a 200 (Ok)" do
          file = Tempfile.new("encryped-secret")
          file.write("a" * max_size)
          file.close

          post :create, params: { secret: fixture_file_upload(file.path) }

          expect(response).to have_http_status(:ok)
          expect(Rails.cache).to have_received(:write)
        end
      end

      context "when encrypted secret is too large" do
        it "returns a 413 (Payload Too Large)" do
          file = Tempfile.new("encryped-secret")
          file.write("a" * (max_size + 1))
          file.close

          post :create, params: { secret: fixture_file_upload(file.path) }

          expect(response).to have_http_status(:content_too_large)
          expect(response.body).to eq("Secret too large")
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
