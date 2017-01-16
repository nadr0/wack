// Application

var ner        = require('ner');
var FeedParser = require('feedparser');
var request    = require('request');
var RssHandler = require('./rssHandler.js').RssHandler;
var RssRequest = require('./request.js').Request;

/**
  * Application to run everything!
  */
function App(options) {

    this.feedparser = null;
    this.rssHandler = null;
    this.rssRequest = null;

    // Settings for application
    if(typeof(options) === 'object') {

        this._RUN = 'run' in options ? options.run : true;

    }

    if(this._RUN) {

        console.log('Application Running.');
        this.init();

        // Add any website requests
        for(website in options.websites) {
            this.rssRequest.add(options.websites[website]);
        }

        this.run();

    }else {
        console.log('Application Not Running.');
    }

}

/**
  * Init function, only call once.
  */
App.prototype.init = function() {

    this.feedparser = new FeedParser([]);
    this.rssHandler = new RssHandler(ner);
    this.rssRequest = new RssRequest();

    this.initFeedParser();

}

/**
  * Sets up the feedparser for any rss request for that can be parsed
  */
App.prototype.initFeedParser = function() {

    this.feedparser.on('error', function (error) {
      // always handle errors
      console.log(error);
      throw new Error('feedparser is broken.');

    });

    // for callback on feedparser
    var _this = this;

    this.feedparser.on('readable', function () {
      // This is where the action is!
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      var item;

      // reding item at a time from the rss feed
      while (item = stream.read()) {

          // Check each story in the RSS feed
          _this.rssHandler.checkParsedXML(item);

      }

    });

}

App.prototype.run = function() {

    this.rssRequest.make(this.feedparser);

}

module.exports = {
    app: App
}
