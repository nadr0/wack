var path = require("path");
var fs = require("fs");
const express = require('express');
const app = express();
const port = process.env.NODE_SERVER_PORT;
var server = require('http').createServer(app);

// Possible website RSS feeds
// http://www.huffingtonpost.com/news/obituary/feed/
// https://www.theguardian.com/tone/obituaries/rss
// http://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml

// application
// const wack = require('./init.js').app;
// const wackApp = new wack({
//     websites:{
//         s1:"http://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml"
//         // s1:"https://www.theguardian.com/tone/obituaries/rss",
//         // s2:"http://www.huffingtonpost.com/news/obituary/feed/"
//     }
// });
//
// var google = require('./gkgs.js');

// var twitter = require('./twitter.js');
// twitter.tweet('works?', function(a){
    // console.log(a,'halp?');
// });


var OAuth = require('oauth').OAuth;
var oa;

var domain = "localhost"
oa = new OAuth(
    "https://twitter.com/oauth/request_token"
  , "https://twitter.com/oauth/access_token"
  , process.env.CONSUMER_KEY
  , process.env.CONSUMER_SECRET
  , "1.0A"
  , "http://" + domain + ":" + port + "/twitter/authn/callback"  , "HMAC-SHA1"
  );

oa.post(
  "https://api.twitter.com/1.1/statuses/update.json"
, process.env.ACCESS_TOKEN
, process.env.ACCESS_TOKEN_SECRET
, {"status": "broke" }
, function(e){console.log(e)}
);

// Files for client
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
    console.log('something getted');
})

server.listen(port);
