class ChangeColumnName < ActiveRecord::Migration[5.1]
    def change
        rename_column :notifications, :unread, :status
        change_column_default :notifications, :status, nil
        change_column :notifications, :status, "integer USING status::integer"
    end
end
