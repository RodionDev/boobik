class User < ApplicationRecord
    has_many :authorizations, dependent: :destroy
    validates :name, :email, :image_url, :presence => true
    def first_name
        name.match /(\w+)/
    end
end
