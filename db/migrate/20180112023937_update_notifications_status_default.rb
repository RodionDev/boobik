class UpdateNotificationsStatusDefault < ActiveRecord::Migration[5.1]
  def change
      change_column_default :notifications, :status, { from: nil, to: 0 }
  end
end
