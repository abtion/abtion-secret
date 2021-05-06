# frozen_string_literal: true

class SecretsController < ApplicationController
  BLOCKED_BOTS = [
    /facebookexternalhit/,
    /Slackbot-LinkExpanding/,
    /Twitterbot/,
    /WhatsApp/,
    /Discord/
  ].freeze

  def new; end

  def show
    should_block = BLOCKED_BOTS.any? do |bot|
      bot =~ request.headers["HTTP_USER_AGENT"]
    end

    redirect_to(root_path) if should_block
  end
end
