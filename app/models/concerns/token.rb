module Token
    extend ActiveSupport::Concern
  
    included do
        before_validation :generate_token, on: :create, prepend: true
    end

    protected
        def generate_token
            self.raw_key = instance_token
        end

        def instance_token
            loop do
                random_token = SecureRandom.alphanumeric(18)
                break random_token unless self.class.exists?(raw_key: random_token)
            end
        end
end