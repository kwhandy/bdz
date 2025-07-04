require "test_helper"

class Editors::Binders::VisiblesControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get editors_binders_visibles_edit_url
    assert_response :success
  end
end
