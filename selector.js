// Selector for the application which is more of searching text to see if we should parse it


function Selector() {

    /** Famous people **/
    this.FAMOUS_PEOPLE_KEYWORDS = ['died', 'dead', 'dies', 'obituary'];

}

/**
  * Returns -1 if the text does not contain a keyword
  * Returns 0 or greater if the text does contain a keyword
  */
Selector.prototype.doesTextHaveKeywords = function(text) {

    // lowercase the string
    text = text.toLowerCase();

    // Default -1
    var doesHave = -1;

    for (var i = 0; i < this.FAMOUS_PEOPLE_KEYWORDS.length; i++) {

        var keyword = this.FAMOUS_PEOPLE_KEYWORDS[i];

        doesHave = doesHave & text.search(keyword);

    }

    return doesHave;

}


Selector.prototype.validDate = function(pubdate) {
    // TODO : timezones with check

    //pubdate: Tue Jan 10 2 017 15:38:33 GMT-0600 (CST),
    var pubdate   = new Date(pubdate);
    var today     = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // publication date is within a day
    if(pubdate > yesterday) {
        return 1;
    }

    return 0;
}

module.exports = {
    Selector: Selector
}
