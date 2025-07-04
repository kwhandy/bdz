module Editors::Binders::Articles::SettingsHelper
    def editor_article_settings_status(status)
        return "public" if status == "published"
        status.end_with?('ed') ? status.chomp('ed') : status
    end
end
