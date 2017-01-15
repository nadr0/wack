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
const wack = require('./init.js').app;
const wackApp = new wack({
    websites:{
        // s1:"http://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml"
        // s1:"https://www.theguardian.com/tone/obituaries/rss"
        s1:"http://www.huffingtonpost.com/news/obituary/feed/"
    }
});

var google = require('./gkgs.js');

// Files for client
app.use(express.static(__dirname + '/public'))

server.listen(port);
