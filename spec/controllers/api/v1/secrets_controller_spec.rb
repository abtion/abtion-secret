# frozen_string_literal: true

require "rails_helper"
require "tempfile"

RSpec.describe(Api::V1::SecretsController) do
  describe "POST /" do
    describe "file size limit" do
      max_size = ENV.fetch("MAX_ENCRYPTED_SECRET_SIZE").to_i

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

          expect(response).to have_http_status(:payload_too_large)
          expect(response.body).to eq("Secret too large")
          expect(Rails.cache).not_to have_received(:write)
        end
      end
    end
  end
end
