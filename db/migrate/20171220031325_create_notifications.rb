class CreateNotifications < ActiveRecord::Migration[5.1]
  def change
    create_table :notifications do |t|
      t.references :user, foreign_key: true
      t.string :title
      t.string :body
      t.references :project, foreign_key: true
      t.boolean :unread
      t.timestamps
    end
    change_column_default :notifications, :unread, true
  end
end
