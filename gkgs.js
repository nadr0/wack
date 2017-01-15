// Google knowledge graph search API setup/requests

// Example URL request
// https://kgsearch.googleapis.com/v1/entities:search?query=taylor+swift&key=API_KEY&limit=1&indent=True

var request = require('request');

function makeGoogleRequest(search, callback) {

    // Format string for url encoding
    search = search.toLowerCase();
    search = search.replace(/\s+/g, '+');

    var api_url = 'https://kgsearch.googleapis.com/v1/entities:search?query='+search+'&key='+process.env.GOOGLE_GKGS_KEY+'&limit=10&indent=True';

    request({url: api_url, json:true}, function(error, response, body){

        if(!error && response.statusCode == 200) {

        //    console.log(body.itemListElement[0]);

           // check if there is one result
           if(body.itemListElement.length > 0) {

               callback(body.itemListElement[0]);

           }else {

               callback(null);

           }
        }

    })

}



module.exports = {
    request:makeGoogleRequest
}