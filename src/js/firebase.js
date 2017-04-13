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
const storageRef = firebase.storage().ref();

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
	},
	imageUpload:(file, callback) =>{
		let folderRef = storageRef.child('images/'+file.name);
		folderRef.put(file).then(function(snapshot) {
		  callback(snapshot)
		});
	}
}





// GET THE IMAGE URL FROM FIREBASE
// // Create a reference to the file we want to download
// var imagesRef = storageRef.child('images/7041606.jpeg');

// // Get the download URL
// imagesRef.getDownloadURL().then(function(url) {
// 	console.log(url);
//   // Insert url into an <img> tag to "download"
// }).catch(function(error) {

// });







export default firebaseApi
