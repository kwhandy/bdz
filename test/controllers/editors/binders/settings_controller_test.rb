require "test_helper"

class Editors::Binders::SettingsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get editors_binders_settings_index_url
    assert_response :success
  end

  test "should get show" do
    get editors_binders_settings_show_url
    assert_response :success
  end
end
