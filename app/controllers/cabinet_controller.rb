require 'nokogiri'
require 'open-uri'

class CabinetController < ApplicationController
	before_filter :authenticate_user!
  def index
  	@audio = Media.audio

  	uri = "http://vk.com/audios146281674?q=%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9%20%D0%9C%D0%B0%D0%BB%D0%B8%D0%BA%D0%BE%D0%B2%20%E2%80%93%20%D0%AF%20%D1%82%D0%B0%D0%BA%20%D1%81%D0%BA%D1%83%D1%87%D0%B0%D1%8E%20%D0%BF%D0%BE%20%D1%82%D0%B5%D0%B1%D0%B5"
  	uri = "http://google.com"

		@doc = Nokogiri::HTML(open(uri))
  end
end
