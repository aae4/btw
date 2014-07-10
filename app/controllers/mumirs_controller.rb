class MumirsController < ApplicationController
  def index
  	if params[:search].present?
  		search_result = Vk.search_audio(session["vk_token"], params[:search])
  		audio = search_result["response"]["audio"]
  		if audio.class == Array
  			@audio =  audio.map{|x| x.slice("artist", "title", "url")}
  		else
  			@audio = [audio.slice("artist", "title", "url")]
  		end
  		@audio.each{|q| q["url"] = q["url"].split("?")[0]}
  	else
  		@audio = []
  	end
  	logger.info("\n========================================\n#{@audio}\n")
  end
end
