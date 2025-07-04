require "test_helper"

class BindersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get binders_index_url
    assert_response :success
  end

  test "should get show" do
    get binders_show_url
    assert_response :success
  end
end
