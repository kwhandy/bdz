class Binder < ApplicationRecord
    include Identifier
  
    extend FriendlyId
    friendly_id :uid, use: :slugged

    has_many :articles, dependent: :destroy
  
    enum :status, [ :drafted, :unlisted, :published ], default: :drafted


    def normalize_friendly_id(val)
      val.to_s.parameterize(preserve_case: true)
    end
end
