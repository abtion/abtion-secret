# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Secrets", type: :request do
  describe "X-Api-Version routing constraint" do
    let(:key) { "known-key" }

    before { Rails.cache.write("secret-#{key}", "ciphertext-bytes") }

    context "when X-Api-Version: v1 is sent" do
      it "routes GET /api/secrets/:id to the v1 API and returns the payload" do
        get "/api/secrets/#{key}", headers: { "X-Api-Version" => "v1" }

        expect(response).to have_http_status(:ok)
        expect(response.body).to eq("ciphertext-bytes")
      end
    end

    context "when the X-Api-Version header is missing" do
      it "falls through to the catch-all secrets#show (renders the React frontend)" do
        get "/api/secrets/#{key}"

        expect(response).to have_http_status(:ok)
        expect(response.body).to include('data-react-component="SecretShow"')
      end
    end

    context "when the X-Api-Version header doesn't match" do
      it "falls through to the catch-all secrets#show (renders the React frontend)" do
        get "/api/secrets/#{key}", headers: { "X-Api-Version" => "v2" }

        expect(response).to have_http_status(:ok)
        expect(response.body).to include('data-react-component="SecretShow"')
      end
    end
  end
end
