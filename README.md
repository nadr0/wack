# wack
This is a node.js application which automatically posts a tweet when a famous person dies.
Basic functionality is implemented, nothing fancy.

"when a famous person dies" means when the famous person ends up in a major news RSS feed because of their death.  

This is not a news source. This is supposed to be an automatic way of posting ``personalized`` tweets about someone who has died. 

### What is used to create this

- [node.js](https://nodejs.org/en/)
- [twitter app](https://apps.twitter.com/)
- [google firebase](https://firebase.google.com/)
- [google knowledge graph](https://www.google.com/intl/bn/insidesearch/features/search/knowledge.html), API key is provided under google's API manager.
- [npm](https://www.npmjs.com/)
- [stanford NER](http://nlp.stanford.edu/software/CRF-NER.shtml), download zip under **getting started** section.

###### node.js
A server to handle API calls. Who needs a front end?

###### twitter app
We need a twitter application with our twitter account to be able to post tweets with code!

###### google firebase
A database to store what dead people we have tweeted about. You wouldn't want to post a tweet about a dead person twice.

What the firebase real time database looks like.
```
{your project name}
|--"dead"
    |--"Some Person"
    |--"Another Person"
    |--"FirstName LastName"
    |--"First Last"
```

###### google knowledge graph
To make the tweets a bit more personal.

I query the knowledge graph with the persons name to get some description about them to use as hashtags. 

###### npm
We need some important javascript packages.

###### stanford NER
A server ran locally which handles NER parsing of text. i.e. Gives us the name of the dead person.

Heres my bash file to start the server. Also the README inside the stanford package is well written.

Note: `stanford-ner-2015-12-09` is the name of the folder. I believe when the code is downloaded it saves the folder name with the current date with the year being one off. You will need to change this folder name for your file. 
``` Bash
# I named this file ner-server.sh
#!/bin/sh
# Put this in the directory in which you extracted the STANFORD NER package.
java -mx1000m -cp stanford-ner-2015-12-09/stanford-ner.jar:stanford-ner-2015-12-09/lib/* edu.stanford.nlp.ie.NERServer  -loadClassifier stanford-ner-2015-12-09/classifiers/english.all.3class.distsim.crf.ser.gz -port 8080 -outputFormat inlineXML
```

### Setting up API keys
Since I am providing source code I don't want my API keys in the code! I used environment variables, feel free to do whatever you want with this but here is an outline for your API keys. The links to each service is listed above under [What is used to create this?](#what-is-used-to-create-this)

Create a bash file with the information below, run it with ``source`` to set the environment variables.
``` Bash
# I named this file env-setup.sh
# Twitter API
export CONSUMER_KEY="{your key}"
export CONSUMER_SECRET="{your key}"
export ACCESS_TOKEN="{your key}"
export ACCESS_TOKEN_SECRET="{your key}"

# Node.js server
export NODE_SERVER_PORT=8000
export NODE_DOMAIN='localhost'

# Google knowledge graph search
export GOOGLE_GKGS_KEY="{your key}"

# Google firebase
export FIREBASE_API_KEY="{your key}"
export FIREBASE_AUTH_DOMAIN="{your key}"
export FIREBASE_DATABASE_URL="{your key}"
export FIREBASE_STORAGE_BUCKET="{your key}"
export FIREBASE_MESSAGE_ID="{your key}"
```

## Running the application
- npm install (when you first pull the project down to get the packages)
- Start the stanford NER server
- Start the node.js server, make sure in ``appOptions.js`` has print only to false.
- Stuff will be tweeting!

My setup for running
```
    // making sure environment variables are set
    source env-setup.sh

    // starting stanford ner server in another terminal or & parameter
    ./ner-server.sh

    // start node server
    node server.js
```

### Overview of how the application works

The main application lives in ``init.js`` and is started from ``server.js``.

Right now the application only parses one website when it runs. So giving it more websites does nothing.

``` Javascript
const wack = require('./init.js').app;
const wackApp = new wack({
    websites:{
        site:"http://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml"
    }
});
```

Then the website given gets parsed and searched.

An article from the RSS feed will only get chosen if it has certain keywords (found in ``selector.js``) and the publication was posted within 24 hours of running the code.

After the article is chosen the title is sent to the stanford NER server for parsing the person name, the N in NER.

Once the name is found it is searched with the google knowledge graph to get any description information about the person to add as hashtags.

Finally, the tweet is composed and sent along with saving it in the firebase database.

##### Sample Tweets
![ScreenShot](https://github.com/nadr0/wack/blob/master/doc/tweets-screenshot.png)


Once the RSS feed is parsed the application is done and sits there so you can shut down the NER and node.js server. Think of running it as an executable as of right now. You can change ``site:"http://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml"`` to a different RSS feed then run the servers again to search for more tweets. This will be changed in the future to make it easier. 

##### Example Terminal Output
```
Application Running.
Making request:  http://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml
(X) [PubDate not within 24 hours of now]  Roberta Peters, Soprano With a Dramatic Entrance, Dies at 86
(X) [PubDate not within 24 hours of now]  George Beall, Prosecutor Who Brought Down Agnew, Dies at 79
(X) [PubDate not within 24 hours of now]  James S. Ackerman, Author of Enduring Books on Architecture, Dies at 97
(X) [PubDate not within 24 hours of now]  Among Deaths in 2016, a Heavy Toll in Pop Music
(X) [PubDate not within 24 hours of now]  Lois Dickson Rice, Trailblazing Executive Behind Pell Grants, Dies at 83
(X) [PubDate not within 24 hours of now]  Nicky Scarfo, Mob Boss Who Plundered Atlantic City in the ’80s, Dies at 87
(X) [PubDate not within 24 hours of now]  Bishop Eddie L. Long, Accused of Sexual Misconduct, Dies at 63
(X) [PubDate not within 24 hours of now]  Hans Berliner, Master Chess Player and Programmer, Dies at 87
(X) [PubDate not within 24 hours of now]  Dick Gautier, Who Played a Rock Star in ‘Bye Bye Birdie,’ Is Dead
(X) [PubDate not within 24 hours of now]  Kevin Starr, Prolific Chronicler of California’s History, Dies at 76
(X) [PubDate not within 24 hours of now]  Jimmy Snuka, Ex-Pro Wrestler Known as Superfly, Dies at 73
(X) [PubDate not within 24 hours of now]  2016 Was a Bad Year for Celebrity Deaths, by These Measures
(X) [PubDate not within 24 hours of now]  Conservationist Bud Lilly, ‘a Trout’s Best Friend,’ Dies at 91
(X) [PubDate not within 24 hours of now]  Tony Rosato, of 1981-82 ‘Saturday Night Live’ Cast, Dies at 62
(X) [PubDate not within 24 hours of now]  The Comedic Side of William Peter Blatty, the Author of ‘The Exorcist’
(X) [PubDate not within 24 hours of now]  Zhou Youguang, Who Made Writing Chinese as Simple as ABC, Dies at 111
(X) [PubDate not within 24 hours of now]  Tommy Allsup, Guitarist, Dies at 85; a Coin Toss Saved His Life
(X) [PubDate not within 24 hours of now]  Buddy Greco, Singer Who Had That Swing, Dies at 90
(X) [PubDate not within 24 hours of now]  William Peter Blatty, Author of ‘The Exorcist,’ Dies at 89
(Firebase)  Henry J Foner marked as seen.
(Firebase)  William Onyeabor marked as seen.
(Firebase)  Roberta Peters marked as seen.
[POSTED TWEET]  What will we do without #WilliamOnyeabor? #RIP #Musician
[POSTED TWEET]  Mourning the passing of #HenryJFoner. #RIP
[POSTED TWEET]  What will we do without #RobertaPeters? #RIP #Singer
```

### file/directory structure?
I have files in the top level directory. 

