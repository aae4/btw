class CreateMedia < ActiveRecord::Migration
  def change
    create_table :media do |t|
      t.string :file_name
      t.string :content_type
      t.string :file_size
      
      t.timestamps
    end
  end
end
