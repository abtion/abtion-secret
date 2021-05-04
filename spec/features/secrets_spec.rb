# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Secrets", type: :feature do
  it "allows storing and fetching a secret" do
    visit root_path

    fill_in "secret", with: "this is a secret"

    click_button "Create secret"

    expect(page).to(
      have_text("Here's the link to your secret. Remember, it can only be opened once!")
    )
  end
end
