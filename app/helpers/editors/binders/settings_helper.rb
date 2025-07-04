module Editors::Binders::SettingsHelper
    def editor_binder_settings_status(status)
        return "public" if status == "published"
        status.end_with?('ed') ? status.chomp('ed') : status
    end
end
