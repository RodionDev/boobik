class Article < ApplicationRecord
	has_many :comments, dependent: :destroy
	validates :title, presence: true, length: { minimum: 5, maximum: 256 }
	validates :text, presence: true, length: { minimum: 5, maximum: 1024 }
end
