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
const storageRef = firebase.storage().ref('/images');

const databaseFolderSystem = firebase.database().ref('/storage/images/folder_system/')
const databaseFolderImages = firebase.database().ref('/storage/images/folder_images/')
	
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
		databaseFolderSystem.on('value', (snapshot) =>{
			return callback(snapshot.val());
		});
	},
	getImageInFolder:(location, callback)=>{
		databaseFolderImages.child(location.key).on('value', (snapshot)=>{
			let imageData = [];

			if(location.key){
				let newCount = snapshot.numChildren();
				databaseFolderSystem.child(location.key).update({'count':newCount});
				if(newCount > 0){
					for(let itemKey in snapshot.val()){
						let image = {
							'id': itemKey,
							'name': snapshot.val()[itemKey].name,
							'url': snapshot.val()[itemKey].url
						}
						imageData.push(image);
					}
				}
			}
			return callback(imageData);
		})
	},
	createImageFolder:(folderName)=>{
		let key = databaseFolderSystem.push().key;
		let newFolder = {
			'name': folderName,
			'count': 0
		}
		let updates = {
			folder_system: {},
			folder_images: {}
		}
		updates.folder_system[key] = newFolder;
		updates.folder_images[key] = '';

		databaseFolderSystem.update(updates.folder_system);
		databaseFolderImages.update(updates.folder_images);
	},
	renameImageFolderName:(key, name)=>{
		let databaseLocation = databaseFolderSystem.child(key);
		databaseLocation.update({'name':name});
	},
	deleteFolder:(locationKey)=>{
		databaseFolderImages.child(locationKey).once('value',(snapshot) =>{
			let temporary = snapshot.val();
			let count = snapshot.numChildren();
			databaseFolderImages.child(locationKey).off();
			databaseFolderSystem.child(locationKey).remove();
			databaseFolderImages.child(locationKey).remove();
			if(count > 0){
				for(let item in temporary){
					let fileData = {
						'key': item,
						'name':  temporary[item].name
					}
					storageRef.child(locationKey+'/'+fileData.key+'/'+fileData.name).delete().then(()=>{
					
					}).catch((erro)=>{
						// console.log(erro);
					});
				}
			}
		})
	},
	imageUpload:(locationKey, files, callback) =>{
		let thatCallback = callback;
		let uploadThisFile = (fileData, callback) => {
			let uploadTask = storageRef.child(locationKey+'/'+fileData.key+'/'+fileData.name).put(fileData.raw);
			let progressOldValue = 0;
			uploadTask.on('state_changed', function(snapshot){
				let progressNewValue = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				let progress = progressNewValue - progressOldValue;
				progressOldValue = progressNewValue;
			  	callback(progress);
			},function(error) {
			}, function() {
				let image = {
					'name': fileData.name,
					'url': uploadTask.snapshot.downloadURL
				}
				let updates = {};
				updates[fileData.key] = image;
				databaseFolderImages.child(locationKey).update(updates);
			})
		}
		files.forEach((file)=>{
			let imageKey = databaseFolderImages.child(locationKey).push().key;
			let fileData = {
				key: imageKey,
				name: file.name,
				raw: file.file
			}
			uploadThisFile(fileData, (progress)=>{
				thatCallback(progress);
			})
		})
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
