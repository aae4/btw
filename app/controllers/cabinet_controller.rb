require 'nokogiri'
require 'open-uri'

class CabinetController < ApplicationController
	before_filter :authenticate_user!
  def index
  	@audio = Media.audio
  	@vk_token = session["vk_token"]
  	logger.info("\n========================================\n#{session["vk_token"]}\n")
  	#https://api.vk.com/method/audio.search.xml?q=%D0%9C%D0%B0%D0%BB%D0%B8%D0%BA%D0%BE%D0%B2&access_token=d48086f3b572d60353c55bb35c99871784fbd91d5ef8aa706d06aa98917778687e8632adb6a90b79f442a
  end
end
