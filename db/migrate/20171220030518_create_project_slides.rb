class CreateProjectSlides < ActiveRecord::Migration[5.1]
  def change
    create_table :project_slides do |t|
      t.references :project, foreign_key: true
      t.string :title
      t.string :body
      t.string :image
      t.timestamps
    end
  end
end
