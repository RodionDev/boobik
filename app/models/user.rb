class User < ApplicationRecord
    has_many :authorizations, dependent: :destroy
    validates :name, :email, :presence => true
    def first_name
        name.match /(\w+)/
    end
end
