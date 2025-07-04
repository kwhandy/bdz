require "test_helper"

class Editors::Binders::Articles::DeletesControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get editors_binders_articles_deletes_show_url
    assert_response :success
  end
end
