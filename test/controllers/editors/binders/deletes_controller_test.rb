require "test_helper"

class Editors::Binders::DeletesControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get editors_binders_deletes_show_url
    assert_response :success
  end
end
