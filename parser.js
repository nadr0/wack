// Parsing for the application
// Parser containts the stanford NER object to handle the requests to the local 8080 server

var database   = require('./database.js');
var twitter    = require('./twitter.js');
var appOptions = require('./appOptions.js').options;
var Message    = require('./message.js').Message;

/**
  * parser is an object that handles the parsing of text from the title, article, etc ...
  * @param ner - stanford NER object to handle the java server NER requests
  */
function Parser(ner) {

    // stanford ner object
    this.ner = ner;
    // Handles formatting of tweets and sends the tweet
    this.message = new Message();

}

/**
  * Sends title to the NER server to retrieve the possible name(s).
  * @param text - string
  */
Parser.prototype.retrieve3NER = function(text) {

    // for callback this
    var _this = this;

    // request from the stanford NER server to parse the data
    this.ner.get({
        port:8080,
        host:'localhost'
    }, text , function(err, res){

        // NER data
        // resulting data
        //=> { LOCATION: [ 'Wikipedia' ], ORGANIZATION: [ 'Wikimedia Foundation'] }
        // console.log(res.entities);

        if(res && res.entities) {
            // Person in string formart to tweet about
            var person = res.entities.PERSON[0];

            // Clear names
            person = person.replace(/\.+/g, '');

            // Check firebase
            database.retrieve(person, function(snapshot) {
                // Not in the database
                // Mark seen
                if(snapshot.val() === null) {

                    // Check if you should only print the people instead of tweeting
                    if(!appOptions.PRINT_ONLY) {
                        // database.markSeen(person);

                        _this.message.create(person);

                    }else {

                        // Print preview what is gonna be tweeted
                        console.log(person);

                    }

                }

            });
        }

    });

}

module.exports = {
    Parser:Parser
}
