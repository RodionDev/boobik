ActiveRecord::Schema.define(version: 20171220005417) do
  enable_extension "plpgsql"
  create_table "authorizations", force: :cascade do |t|
    t.string "provider"
    t.string "uid"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.index ["user_id"], name: "index_authorizations_on_user_id"
  end
  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_url"
  end
  add_foreign_key "authorizations", "users"
end
