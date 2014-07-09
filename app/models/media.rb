class Media < ActiveRecord::Base
	mount_uploader :file_name, MediaUploader
	#scope :audio, where('file_name.content_type like ?', 'audio')
	scope :audio, lambda { where('content_type REGEXP ?', "^audio") }

	def local_path
		return file_name.to_s
	end

	def name
		return file_name.file.original_filename
	end

end
