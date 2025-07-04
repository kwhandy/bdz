require "test_helper"

class Editors::Binders::ArticlesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get editors_binders_articles_index_url
    assert_response :success
  end

  test "should get edit" do
    get editors_binders_articles_edit_url
    assert_response :success
  end
end
