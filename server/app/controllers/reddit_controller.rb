require 'httparty'
require 'json'

class RedditController < ApplicationController
    def list
        response = []
        url =  'https://www.reddit.com/top.json?limit=50'
        uri = URI(url)
        # @TODO: Validate the response
        responseReddit = HTTParty.get(uri)
        
        if responseReddit['data']
            data = responseReddit['data']['children']
            # @TODO: Decorator  or use model for map 
            response = data.map do |post|
                {
                    :id => post['data']['id'],
                    :title => post['data']['title'],
                    :author => post['data']['author'],
                    :created_utc => post['data']['created_utc'],
                    :num_comments => post['data']['num_comments'],
                    :thumbnail => post['data']['thumbnail'],
                    :thumbnail_width => post['data']['thumbnail_width'],
                    :thumbnail_height => post['data']['thumbnail_height'],
                    :preview => post['data']['preview']
                }
            end
        end

        render json: response, status: 200
    end

end
