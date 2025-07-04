class CreateArticles < ActiveRecord::Migration[8.0]
  def change
    create_table :articles do |t|
      t.string :uid, null: false
      t.string :slug, null: false
      t.text :content
      t.datetime :content_sync_time
      t.string :title
      t.string :subtitle
      t.string :seo_title  # max 58 varchar
      t.string :seo_description  # max 80 varchar
      t.boolean :highlight, default: false
      t.integer :status, default: 0  # 0 private, 1 public
      t.string :raw_key, null: false
      t.belongs_to :binder, null: false, foreign_key: true

      # add header (rectangle image/ landscape)

      t.timestamps
    end
    add_index :articles, :uid, unique: true
    add_index :articles, :slug, unique: true
  end
end
