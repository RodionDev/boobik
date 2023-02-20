class Project < ApplicationRecord
    belongs_to :user
    has_many :project_slides
    has_many :notifications
end
