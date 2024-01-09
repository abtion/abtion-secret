# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Secrets" do
  it "allows storing and fetching a secret" do
    visit root_path

    fill_in "secret", with: "this is a secret"

    click_on "Create link"

    expect(page).to(
      have_text("Link generated")
    )

    secret_url = page.find("input[readOnly]").value

    visit secret_url

    expect(page).to have_text("Loading your secret...")
    expect(page).to have_no_field(name: "secret")

    expect(page).to have_text("Here is your secret")
    expect(page).to have_field(name: "secret", with: "this is a secret")
  end

  context "when visiting a secret twice" do
    it "only shows the secret the first time" do
      visit root_path

      fill_in "secret", with: "this is a secret"

      click_on "Create link"
      secret_url = page.find("input[readOnly]").value

      visit secret_url

      expect(page).to have_text("Here is your secret")

      refresh

      expect(page).to have_text("Your secret is gone...")
    end
  end

  context "when there's no such secret" do
    it "shows a failure message" do
      visit "not-a-key#not-a-password"

      expect(page).to have_text("Loading your secret...")
      expect(page).to have_no_field(name: "secret")

      expect(page).to have_text("Your secret is gone...")
      expect(page).to have_button("Share a secret")
    end
  end

  context "when the secret is too long" do
    it "disables the submit button and instead shows a disclaimer" do
      visit root_path
      max_secret_chars = ENV.fetch("MAX_SECRET_CHARS").to_i

      too_long_secret = "a" * (max_secret_chars + 1)

      fill_in "secret", with: too_long_secret

      expect(page).to have_no_button("Create link")
      expect(page).to(
        have_button("Secret is too long (#{too_long_secret.size} / #{max_secret_chars})",
                    disabled: true)
      )
    end
  end
end
