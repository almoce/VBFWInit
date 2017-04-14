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
const storageDatabase = firebase.database().ref('/storage')
const imagesStorage = firebase.database().ref('/storage/images')


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
	getImageStorageDatabase:(callback)=>{
		imagesStorage.child('folder_system/').on('value', (snapshot) =>{
			return callback(snapshot.val());
		});
	},
	getImageInFolder:(location, callback)=>{
		imagesStorage.child('folder_images/'+location.key).on('value', (snapshot)=>{
			if(location.key){
				let newCount = snapshot.numChildren();
				let countRfe = firebase.database().ref('/storage/images/folder_system/'+location.key+'/count');
				countRfe.transaction((count)=>{
					return count = newCount;
				})
			}
			return callback(snapshot.val());
		})
	},
	createImageFolder:(folderName)=>{
		let newFolder = {
			'name': folderName,
			'count': 0
		}
		let newKey = imagesStorage.child('folder_system/').push().key;
		let updates = {}
		updates['folder_system/' + newKey] = newFolder;
		updates['folder_images/' + newKey] = '';
		imagesStorage.update(updates);
	},
	deleteFolder:(key)=>{
		imagesStorage.child('folder_images/'+key).once('value',(snapshot) =>{
			let temporary = snapshot.val();
			imagesStorage.child('folder_images/'+key).off();
			let updates = {}
			updates['folder_system/' + key] = null;
			updates['folder_images/' + key] = null;
			imagesStorage.update(updates);

			for(let item in temporary){
				let fileRef = storageRef.child('images/'+key+'/'+temporary[item].name);
				fileRef.delete().then(()=>{
				}).catch((erro)=>{
					console.log(erro);
				});
			}
		})
	},
	imageUpload:(location, file, callback) =>{
		let folderRef = storageRef.child('images/'+location.key+'/'+file.name);
		folderRef.put(file).then(function(snapshot) {
			let newKey = imagesStorage.push().key;
			let updates = {}
			let image = {
				name: file.name,
				url: snapshot.downloadURL
			}
			updates['folder_images/'+location.key+'/'+newKey] = image;
			imagesStorage.update(updates);
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
