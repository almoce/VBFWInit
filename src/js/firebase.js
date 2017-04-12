import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';


let config = {
	apiKey: 'APIKEY',
	databaseURL: 'DATABASEURL'
}

//LOCAL KEY INJECTION
var key = require('../../firebasekey.js');
config = key.default;



const app = firebase.initializeApp(config);
const storage = firebase.storage();

// const api = Firebase.database()
// const fireAuth = firebase.auth();


const firebaseApi = {
	auth:(callback) => {
		firebase.auth().onAuthStateChanged(function(user) {
			return callback(user);
		});
	},
	signInWithEmail: (email, password, callback) => {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			return callback(errorMessage);
		});
	},
	signOut: (callback) => {
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			return null;
		}).catch(function(error) {
			// An error happened.
			return callback(error);
		});
		
	}
}

export default firebaseApi
