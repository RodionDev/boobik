class RemoveUpdatedAtColumnFromAuthorizations < ActiveRecord::Migration[5.1]
  def change
      remove_column :authorizations, :updated_at
  end
end
