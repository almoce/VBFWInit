import {firebaseApi} from './api.js'

const imagesDatabase = {
	namespaced: true,
	state:{
		location: {
			'name':'',
			'key':''
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
		imageUpload({state}, file){
			return new Promise((resolve, reject) => {
				firebaseApi.imageUpload(state.location, file, (sp)=>{
					resolve(sp);
				})
			})
		},
		createFolder({}, name){
			return new Promise((resolve,reject)=>{
				firebaseApi.createImageFolder(name);
				resolve();
			})
		},
		deleteFolder({}, key){
			firebaseApi.deleteFolder(key);
		},
		changeLocation({commit, state}, data){
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
		
		}
	}
}

export default imagesDatabase