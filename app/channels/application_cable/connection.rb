module ApplicationCable
	class Connection < ActionCable::Connection::Base
		identified_by :current_user
		def connect
			self.current_user = verify_current_user
		end
	private
		def verify_current_user
			if user = User.find_by_id_and_auth_token( cookies.encrypted[:user_id], cookies.encrypted[:auth_token] ) then
				user
			else
				reject_unauthorized_connection
			end
		end
	end
end
