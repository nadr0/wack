//  setup oauth and twitter shit
// INFO: helps auto send tweets in code example
// https://git.daplie.com/coolaj86/node-twitter-demo/blob/master/app.js

const KEY         = process.env.CONSUMER_KEY;
const SECRET      = process.env.CONSUMER_SECRET;
const token       = process.env.ACCESS_TOKEN;
const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
const port        = process.env.NODE_SERVER_PORT;
const domain      = process.env.NODE_DOMAIN;

var OAuth = require('oauth').OAuth;
var oa;

// Tokens for tweeting
var site = "https://api.twitter.com/1.1/statuses/update.json";

function makeTweet(status, cb) {

    oa = new OAuth(
        "https://twitter.com/oauth/request_token"
      , "https://twitter.com/oauth/access_token"
      , KEY
      , SECRET
      , "1.0A"
      , "http://" + domain + ":" + port + "/"
      , "HMAC-SHA1"
      );

    var statusToTweet = {"status": status};

    oa.post(site, token, tokenSecret, statusToTweet, cb);

}

module.exports = {
    tweet: makeTweet
}
