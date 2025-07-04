require "test_helper"

class Editors::Binders::Articles::FilenamesControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get editors_binders_articles_filenames_edit_url
    assert_response :success
  end
end
