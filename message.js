// Tweets the dead person

var gkgs       = require('./gkgs.js');
var twitter    = require('./twitter.js');
var appOptions = require('./appOptions.js').options;

/**
  * Message object handles google knowledge graph search and posting the tweet
  * @constructor
  */
function Message() {

    // replace {-} with a name for some string.
    this.messages = [
        '{-} is dead :( #RIP'
    ];

}

/**
  * Randomly picks a default message to tweet
  * @returns {string} - a message to tweet
  */
Message.prototype.getMessage = function() {

    // Compute random index for a message
    var index =  Math.floor(Math.random() * this.messages.length);

    return this.messages[index];

}

/**
  * Creates a tweet then tweets it.
  * Determines if the result from google knowledge graph is helpful, if so
  * it will use the information from the search in the tweet
  * else the tweet is just a generic tweet
  * @param {string} search - mainly names right now, i.g "John Bob"
  */
Message.prototype.create = function(search) {

    // for callback
    var _this = this;

    this.searchGoogle(search, function(body) {

        // Remove spaces from the persons name
        var hashtagPerson = search.replace(/\s+/g, '');

        // Checking if the result from google knowledge graph is not null
        if(body != null) {

            var hashtags = '';

            // Checks to see if the description property is present
            if(typeof(body.result.description) === 'string') {

                // Get the hashtags to add at the end of the tweet
                hashtags = _this.createHashTags(body.result.description);

            }

            var tweet = _this.composeTweet(hashtagPerson, hashtags);

            twitter.tweet(tweet, function(){
                console.log(tweet,' - posted a tweet');
            })

        }else {
            // basic tweet, no hashtags

            var tweet = _this.composeTweet(hashtagPerson);

            twitter.tweet(tweet, function(){
                console.log(tweet, ' - posted a tweet');
            })

        }

    });

}

/**
  *  Given a string it will parse it into as many words as possible and return a string of hashtags
  * @param {string} text - some text lol
  * @return {string} hashtags - a chain of hashtags
  */
Message.prototype.createHashTags = function(text) {

    if(!text) {
        return '';
    }

    // Google description result can have hyphens/dashes in the results so remove any and replace with a space.
    text = text.replace(/-+/g,' ');

    // Replace all spaces with a hashtag
    text = text.replace(/\s+/g,' #');

    // Leading word will not have a hashtag so add it
    text = '#' + text;

    // hashtag string
    return text;

}

/**
  * Creates the string to tweet given the name of the person and hashtags
  * @param {string} hashTagPerson  - the person's name in hashtag form
  * @param {string} hashTags - at least one or more hashtags in a row
  * @return {string} tweet - the tweet
  */
Message.prototype.composeTweet = function(hashTagPerson, hashTags) {

    var tweet = '';

    if(hashTags) {

        tweet = '#' + hashTagPerson + ' is dead :( #RIP ' + hashTags;

    }else {

        tweet = '#' + hashTagPerson + ' is dead :( #RIP ';
    }


    return tweet;
}

/**
  * Calls the google knowledge graph
  * @param {string} search - mainly names right now, i.g "John Bob"
  * @param {function} callback - callback function
  */
Message.prototype.searchGoogle = function(search, callback) {

    // retrieve top result from the google request
    gkgs.request(search, callback);

}

module.exports = {
    Message: Message
}
