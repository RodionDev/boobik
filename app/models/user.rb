class User < ApplicationRecord
    has_many :authorizations
    validates :name, :email, :presence => true
    def first_name
        name.match /(\w+)/
    end
end
