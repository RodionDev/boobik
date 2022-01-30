class User < ApplicationRecord
    has_many :authorizations, dependent: :destroy
    has_many :projects
    validates :name, :email, :image_url, :presence => true
    def first_name
        name.match /(\w+)/
    end
    def generate_auth_token
        until update( auth_token: SecureRandom.uuid )
            puts "WARNING: Regenerating auth_token for user #{name}. Failed to update. Likely due to auth_token not being unique."
        end
    end
end
