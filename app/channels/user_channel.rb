class UserChannel < ApplicationCable::Channel
	def subscribed
        stop_all_streams
        stream_from "user_status:#{current_user.id}"
	end
end
