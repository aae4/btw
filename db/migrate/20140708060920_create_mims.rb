class CreateMims < ActiveRecord::Migration
  def change
    create_table :mims do |t|
    	t.text :description_markdown
    	t.text :description_html
    	t.integer :user_id

      t.timestamps
    end
  end
end
