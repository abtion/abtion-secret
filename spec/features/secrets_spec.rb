# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Secrets", type: :feature do
  it "allows storing and fetching a secret" do
    visit root_path

    fill_in "secret", with: "this is a secret"

    click_button "Create link"

    expect(page).to(
      have_text("Link generated")
    )

    secret_url = page.find("input[readOnly]").value

    visit secret_url

    expect(page).to have_text("Loading your secret...")
    expect(page).not_to have_field(name: "secret")

    expect(page).to have_text("Here is your secret")
    expect(page).to have_field(name: "secret", with: "this is a secret")
  end

  context "when visiting a secret twice" do
    it "only shows the secret the first time" do
      visit root_path

      fill_in "secret", with: "this is a secret"

      click_button "Create link"
      secret_url = page.find("input[readOnly]").value

      visit secret_url

      expect(page).to have_text("Here is your secret")

      visit secret_url

      expect(page).to have_text("Your secret is gone...")
    end
  end

  context "when there's no such secret" do
    it "shows a failure message" do
      visit "not-a-key#not-a-password"

      expect(page).to have_text("Loading your secret...")
      expect(page).not_to have_field(name: "secret")

      expect(page).to have_text("Your secret is gone...")
      expect(page).to have_button("Share a secret")
    end
  end
end
