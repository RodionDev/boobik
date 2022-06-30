class Project < ApplicationRecord
    belongs_to :user
    has_many :project_slides
    has_many :notifications
    def formatted_status
        case status
        when 1
            "Submitted for Approval"
        when 2
            "Processing"
        when 3
            "Video Complete"
        when 4
            "Request Rejected"
        end
    end
end
