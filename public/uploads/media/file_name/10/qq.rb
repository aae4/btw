class NewsParser
	attr_accessor :queries, :contents
	def initialize a, h
	   @queries = a
	   @contents = h
	end
end

@news_parser = NewsParser.new([1,2,3], {1 => 3})
puts "In controller"
puts @news_parser.contents
@news_parser.save
