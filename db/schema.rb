ActiveRecord::Schema.define(version: 20171220031325) do
  enable_extension "plpgsql"
  create_table "authorizations", force: :cascade do |t|
    t.string "provider"
    t.string "uid"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.index ["user_id"], name: "index_authorizations_on_user_id"
  end
  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.string "body"
    t.bigint "project_id"
    t.boolean "unread", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_notifications_on_project_id"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end
  create_table "project_slides", force: :cascade do |t|
    t.bigint "project_id"
    t.string "title"
    t.string "body"
    t.string "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_slides_on_project_id"
  end
  create_table "projects", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.string "desc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_projects_on_user_id"
  end
  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_url"
  end
  add_foreign_key "authorizations", "users"
  add_foreign_key "notifications", "projects"
  add_foreign_key "notifications", "users"
  add_foreign_key "project_slides", "projects"
  add_foreign_key "projects", "users"
end
