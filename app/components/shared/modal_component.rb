# frozen_string_literal: true

class Shared::ModalComponent < ApplicationComponent

    include Components::Shared::ModalHelper
  
    def initialize(
      frame: true, 
      close_button: true, 
      auto_close: true,
      advance_history: true, 
      advance_history_url: nil
    )
      @frame = frame
      @close_button = close_button
      @auto_close = auto_close
      @advance_history = advance_history
      @advance_history_url = advance_history_url
    end
  
    def frame?
      !!@frame
    end
  
    def advance_history?
      !!@advance_history
    end
  
    def close_button?
      !!@close_button && frame?
    end
  
    def frame_classes
      c =
        "relative transform overflow-hidden bg-white text-left transition-all sm:my-8 w-full sm:w-auto sm:max-w-3xl"
      c = c + " p-4 sm:p-6" if frame?
      c = c + " p-2" if !frame?
      c
    end
  
    def x_button_classes
      "ml-auto inline-flex items-center p-1 text-sm text-gray-400 bg-gray-100 hover:text-gray-900"
    end
  
    def x_icon_classes
      "size-6"
    end
  
    def close_action
      "modal#hideModal"
    end
  
    def modal_action
      if @auto_close == true
        "turbo:submit-end->modal#submitEnd"
      elsif @auto_close == false
        ""
      end
    end
  
    def overlay_action
      "click->modal#outsideModalClicked"
    end
  
    def transition_data
      {
        transition_enter: "ease-out duration-100",
        transition_enter_start: "opacity-0",
        transition_enter_end: "opacity-100",
        transition_leave: "ease-in duration-100",
        transition_leave_start: "opacity-100",
        transition_leave_end: "opacity-0"
      }
    end
  
    def turbo_stream?
      request.format == :turbo_stream
    end
  
    def turbo_frame?
      request.headers["Turbo-Frame"].present?
    end
  
    def advance_history_url
      return nil unless advance_history?
      @advance_history_url || request.original_url
    end
end