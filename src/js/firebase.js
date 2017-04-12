import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import {store} from './api.js'


let config = {
	apiKey: 'APIKEY',
	databaseURL: 'DATABASEURL'
}

//LOCAL KEY INJECTION
var key = require('../../firebasekey.js');
config = key.default;



const app = firebase.initializeApp(config);
// const api = Firebase.database()
// const fireAuth = firebase.auth();

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		store.dispatch('userLogIn')
	} else {
		// No user is signed in.
		store.dispatch('userLogOut')
	}
});


const firebaseApi = {
	signInWithEmail: (email, password, callback) => {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// ...
				if (errorMessage) {
					return callback(errorMessage)
				}
			});
	},
	signOut: (callback) => {
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			store.dispatch('userLogOut')
		}).catch(function(error) {
			// An error happened.
			return callback(error);
		});
	}
}

export default firebaseApi
