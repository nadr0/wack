var Selector = require('./selector.js').Selector;
var Parser = require('./parser.js').Parser;

function RssHandler(ner) {

    this.selector = new Selector();
    this.parser   = new Parser(ner);

}

RssHandler.prototype.checkParsedXML = function(item) {

    // Simple model for only title and description
    // Model only searchs keywords for 'Famous People'
    var itemHasKeywordsInTitle = this.selector.doesTextHaveKeywords(item['title']);

    var parsedTitle       = null;
    var parsedDescription = null;
    var pubdate           = item['pubdate'];
    var validDate         = this.selector.validDate(pubdate);

    // Check if the date is valid
    if(validDate) {

        // Has keyword(s) in title
        if(itemHasKeywordsInTitle) {
            this.parser.retrieve3NER(item['title']);
        }

    } else {

        // Person did not die within 24 hours of this application running.
        console.log('(X)  ', item['title']);

    }

}

module.exports = {
    RssHandler:RssHandler
}
