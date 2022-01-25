class User < ApplicationRecord
    has_many :authorizations, dependent: :destroy
    has_many :projects
    validates :name, :email, :image_url, :presence => true
    def first_name
        name.match /(\w+)/
    end
end
