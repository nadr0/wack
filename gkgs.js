// Google knowledge graph search API setup/requests

// Example URL request
// https://kgsearch.googleapis.com/v1/entities:search?query=taylor+swift&key=API_KEY&limit=1&indent=True

var request = require('request');

/**
  * Makes a request to the google knowledge graph search
  * Takes the top request from the list of 10 requests.
  * @param {string} search - mainly names right now, i.g "John Bob"
  * @param {function} callback - callback function
  */
function makeGoogleRequest(search, callback) {

    // Format string for url encoding
    search = search.toLowerCase();
    search = search.replace(/\s+/g, '+');

    var api_url = 'https://kgsearch.googleapis.com/v1/entities:search?query='+search+'&key='+process.env.GOOGLE_GKGS_KEY+'&limit=10&indent=True';

    request({url: api_url, json:true}, function(error, response, body){

        if(!error && response.statusCode == 200) {

           // check if there is one result
           if(body.itemListElement.length > 0) {

               // This takes the top result from the query
               // Top result is usually the wikipedia article of the person
               callback(body.itemListElement[0]);

           }else {

               callback(null);

           }
       }else {
           console.log(error);
           throw new Error('Something with google knowledge graph api call broke.');
       }

    })

}



module.exports = {
    request:makeGoogleRequest
}
