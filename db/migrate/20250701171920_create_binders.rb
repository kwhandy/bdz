class CreateBinders < ActiveRecord::Migration[8.0]
  def change
    create_table :binders do |t|
      t.string :uid, null: false
      t.string :slug, null: false
      t.string :title, null: false
      t.string :description
      t.string :seo_title  # max 58 varchar
      t.string :seo_description  # max 80 varchar
      t.boolean :highlight, default: false
      t.integer :status, default: 0  # 0 private, 1 public

      # add header (rectangle image/ potrait)

      t.timestamps
    end
    add_index :binders, :uid, unique: true
    add_index :binders, :slug, unique: true
  end
end
