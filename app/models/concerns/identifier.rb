module Identifier
    extend ActiveSupport::Concern
  
    included do
        before_validation :generate_uid, on: :create, prepend: true
    end

    protected
        def generate_uid
            self.uid = instance_identity
        end

        def instance_identity
            loop do
                random_uid = SecureRandom.uuid
                break random_uid unless self.class.exists?(uid: random_uid)
            end
        end
end