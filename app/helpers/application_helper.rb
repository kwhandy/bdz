module ApplicationHelper
    include Pagy::Frontend

    def show_in_action?(controller, action)
        controller_name == controller && action_name == action
    end
end
