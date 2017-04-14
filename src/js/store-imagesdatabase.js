import {firebaseApi} from './api.js'

const imagesDatabase = {
	namespaced: true,
	state:{
		location: {
			'name':'',
			'key':''
		},
		uploadProgress: {
			'total': 100,
			'current': 0,
			'percentage':0,
			'folder_key': null
		},
		folder_system:[],
		sub_folder_images:[]
	},
	getters:{
		locationName(state){
			return state.location.name;
		}
	},
	mutations:{
		dataInit(state, data){
			state.folder_system = data ? data:[];
		},
		changeLocation(state, data){
			if(data){
				state.location.name = data.name;
				state.location.key = data.key;
			} else{
				state.location.name = '',
				state.location.key = '';
			}
		},
		loadFolderImage(state, data){
			state.sub_folder_images = data ? data:[];
		},
		changeProgress(state, data){
			state.uploadProgress.folder_key = data.folder_key;
			state.uploadProgress.total = data.count * 100;
			state.uploadProgress.current = data.current;
			state.uploadProgress.percentage = (state.uploadProgress.current/state.uploadProgress.total)*100;
		}
	},
	actions:{
		dataInit({commit, state}){
			return new Promise((resolve, reject)=>{
				firebaseApi.getImageStorageDatabase((data) =>{
					commit('dataInit', data);
					resolve();
				})			
			})
		},
		createFolder({}, name){
			return new Promise((resolve,reject)=>{
				firebaseApi.createImageFolder(name);
				resolve();
			})
		},
		renameFolder({commit, state}, name){
			firebaseApi.renameImageFolderName(state.location.key, name);
			let data = {
				'name': name,
				'key': state.location.key 
			}
			commit('changeLocation', data);
		},
		deleteFolder({}, key){
			firebaseApi.deleteFolder(key);
		},
		changeLocation({commit}, data){
			if(data){
				new Promise((resolve, reject) => {
					firebaseApi.getImageInFolder(data, (imageData)=>{
						commit('changeLocation', data);
						commit('loadFolderImage', imageData);
						resolve();
					})
				})
			} else{
				commit('changeLocation');
				commit('loadFolderImage');
			}
		
		},
		imageUpload({commit, state}, files){
			return new Promise((resolve, reject) => {
				let data = {
					folder_key:state.location.key,
					count: files.length,
					current: 0
				}
				firebaseApi.imageUpload(state.location.key, files, (progress)=>{
					data.current = data.current + progress;
					commit('changeProgress', data);
					if(data.current >= data.count*100){
						resolve()
					}
				})
			})
		},
	}
}

export default imagesDatabase