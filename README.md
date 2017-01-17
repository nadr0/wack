# wack
This is a node.js application which automatically posts tweets about famous dead people.
Basic functionality is implemented, nothing fancy.

### What is used to create this?

- [node.js](https://nodejs.org/en/)
- [twitter app](https://apps.twitter.com/)
- [google firebase](https://firebase.google.com/)
- [google knowledge graph](https://www.google.com/intl/bn/insidesearch/features/search/knowledge.html)
- [npm](https://www.npmjs.com/)
- [stanford NER](http://nlp.stanford.edu/software/CRF-NER.shtml), download zip under **getting started** section.


###### node.js
A server to handle API calls. Who needs a front end?

###### twitter app
We need a twitter application with our twitter account to be able to post tweets with code!

###### google firebase
A database to store what dead people we have tweeted about. You wouldn't want to post a tweet about a dead person twice.

###### google knowledge graph
To make the tweets a bit more personal.

###### npm
We need some important javascript packages.


### Setting up API keys
Since I am providing source code I don't want my API keys in the code! I used environment variables, feel free to do whatever you want with this but here is an outline for your API keys.

Create a bash file with the information below, run it with ```source`` to set the environment variables.
```
# Twitter API
export CONSUMER_KEY="{your key}"
export CONSUMER_SECRET="{your key}"s
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

### Overview of how the application works

The main application lives in *init.js* and is started from *server.js*.

Right now the application only parses one website when it runs. So giving it more websites does nothing.

```
const wack = require('./init.js').app;
const wackApp = new wack({
    websites:{
        site:"http://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml"
    }
});
```
