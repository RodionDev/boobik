class AddForeignKeyToAuthorizationTable < ActiveRecord::Migration[5.1]
  def change
      add_index :authorizations, :user_id
      add_foreign_key :authorizations, :users
  end
end
