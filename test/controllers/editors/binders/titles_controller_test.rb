require "test_helper"

class Editors::Binders::TitlesControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get editors_binders_titles_edit_url
    assert_response :success
  end
end
