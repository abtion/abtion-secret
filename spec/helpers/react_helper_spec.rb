require "rails_helper"

RSpec.describe ReactHelper do
  context "when passing React props" do
    it "renders the props in data " do
      html = react_component('Foo', { bar: 'value' })
      expected_props = %w(data-react-component="Foo" data-react-props="{&quot;bar&quot;:&quot;value&quot;}")

      expected_props.each do |segment|
        expect(html).to include(segment)
      end
    end
  end

  context "when passing caramelized props" do
    it "renders the props in data " do
      html = helper.react_component('Foo', { foo_bar: 'value' })
      expected_props = %w(data-react-component="Foo" data-react-props="{&quot;fooBar&quot;:&quot;value&quot;}")

      expected_props.each do |segment|
        expect(html).to include(segment)
      end
    end
  end
end
