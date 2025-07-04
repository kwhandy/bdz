require "test_helper"

class Editors::BindersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get editors_binders_index_url
    assert_response :success
  end

  test "should get show" do
    get editors_binders_show_url
    assert_response :success
  end

  test "should get new" do
    get editors_binders_new_url
    assert_response :success
  end
end
