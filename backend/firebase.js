require('dotenv').config();
var admin = require('firebase-admin');
var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'ceshinykids.appspot.com'
});

var db = admin.firestore();
var bucket = admin.storage().bucket();

module.exports = {
    db,
    bucket
};
