class ChangeStatusFromStringToInteger < ActiveRecord::Migration[5.1]
  def change
      change_column :projects, :status, 'integer USING CAST(status AS integer)'
  end
end
