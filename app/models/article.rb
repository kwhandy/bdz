class Article < ApplicationRecord
    include Identifier
    include Token

    extend FriendlyId
    friendly_id :uid, use: :slugged
  
    
    belongs_to :binder
  
    enum :status, [ :drafted, :unlisted, :published ], default: :drafted
  
      before_create :set_initial_content_sync_time
  before_update :update_content_sync_time, if: :will_save_change_to_content?

    def normalize_friendly_id(val)
      val.to_s.parameterize(preserve_case: true)
    end

    def draft_key
      "#{self.uid}#{self.binder.uid.slice(0..5)}-#{self.raw_key}"
    end

    def blank_title
      "Untitled--#{self.created_at.to_formatted_s(:number).slice(0..7)}"
    end

  private
    def set_initial_content_sync_time
      self.content_sync_time = self.created_at || Time.current
    end

    def update_content_sync_time
      self.content_sync_time = Time.current
    end
end
