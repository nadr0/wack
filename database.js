// Handles firebase calls

/**
 * Firsebase Auth
 */
var firebase = require('firebase');
var gApp = firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGE_ID
    }
);

/**
  * dead/ inside the firebase database will mark {text} as true
  * @param {string} text - some string that will be marked as true
  */
function markAsSeen(text) {

    // HARDCODED : 'dead' for dead famous people
    firebase.database().ref().child('dead/' + text).set(true).then(function(snapshot){
        console.log(text, 'marked as seen.');
    })

}

/**
  * Checks to see if the text value is in the database
  * @param {string} text - some string that will be used to query to see if its in the database
  * @param {function} callback - callback function that passed the snapshot as an argument
  */
function retrieve(text, callback) {

    // HARDCODED : 'dead'
    firebase.database().ref().child('dead/' + text).once('value').then(function(snapshot) {
        callback(snapshot);
    })

}

module.exports = {
    markSeen: markAsSeen,
    retrieve: retrieve
}
