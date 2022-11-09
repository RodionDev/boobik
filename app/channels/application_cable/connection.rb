module ApplicationCable
	class Connection < ActionCable::Connection::Base
		identified_by :current_user
		def connect
			self.current_user = verify_current_user
		end
	private
		def verify_current_user
			if user = User.find_by_id_and_auth_token( session[:user_id], session[:auth_token] ) then
				user
			else
				raise "Refusing to establish web socket connection; user either not found, or auth_token has expired"
			end
		end
	end
end
