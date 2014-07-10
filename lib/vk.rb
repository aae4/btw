class Vk
	VK_API_URL  = "https://api.vk.com/method"

	def self.search_audio(token, q)
		method = "/audio.search.xml"
		url = VK_API_URL + method + "?q=" + q + "&access_token=" + token
		encoded_url = URI.encode(url)
		uri = URI.parse(encoded_url)
		search = Net::HTTP.get(uri)
    #Rails.logger.info("\n======================\n#{Hash.from_xml(search)}")
    #search_result = REXML::Document.new(search.force_encoding("UTF-8"))
    #search_result = Nokogiri::XML(search)
    #return search_result
    return Hash.from_xml(search)
    #Rails.logger.info("\n======================\n#{search_result}")
	end
end