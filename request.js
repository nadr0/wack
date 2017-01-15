// Request objects allows for requesting multiple sites to RSS search

var request = require('request');

function Request() {

    // Requests to make
    // if empty no request to make
    this.requests = [];

}

/**
  * Adds a request to the data structure
  * @param {string} website - a url for an RSS feed
  * @param {array} website - an array of urls for an RSS feed
  */
Request.prototype.add = function(website) {

    if(Array.isArray(website)) {

        for(var i = 0; i < website.length; i++) {
            this.requests.push(website[i]);
        }

    }else {

        this.requests.push(website);

    }
}

/**
  * Makes a request to the RSS feed for parsing/selecting etc..
  */
Request.prototype.make = function(feedparser) {

    if(this.requests.length > 0) {

        // TODO: Handle failing? Maybe repeat the request at the back.

        // Get current request which is a website link
        var currentRequest = this.requests[0];

        console.log('Making request: ', currentRequest);

        // Remove the request from the array
        this.requests.splice(0,1);

        var req = request(currentRequest);

        req.on('error', function (error) {
          // handle any request errors
          console.log(error);
          throw new Error('something broken with the request for ', currentRequest);
        });

        req.on('response', function (res) {
          var stream = this; // `this` is `req`, which is a stream

          if (res.statusCode !== 200) {
            this.emit('error', new Error('Bad status code'));
          }
          else {
            stream.pipe(feedparser);
          }

        });

    }else {

        // No more requests to be made
        throw new Error('Out Of Requests.');

    }

}


module.exports = {
    Request: Request
}
