import Vue from 'vue'
import Vuex from 'vuex'
import {firebaseApi} from './api.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		auth: false
	},
	getters: {
		auth: state => {
			return state.auth;
		}
	},
	mutations: {
		auth(state, auth) {
			state.auth = auth;
		}
	},
	actions: {
		authCheck({commit}){
			return new Promise((resolve, reject) => {
				firebaseApi.auth((user)=>{
					if(user){
						commit('auth', true);
					} else {
						commit('auth', false);
					}
					resolve();
				});		
			})
		},
		userLogIn({}, data) {
			return	new Promise((resolve, reject) => {
				firebaseApi.signInWithEmail(data.email, data.password, (erro) => {
					resolve(erro);
				});	
			})
		},
		userLogOut({}) {
			return new Promise((resolve, reject) => {
				firebaseApi.signOut((erro) => {
					resolve(erro);
				})
			})
		},
		imageUpload({}, file){
			return new Promise((resolve, reject) => {
				firebaseApi.imageUpload(file, (sp)=>{
					resolve(sp);
				})
			})
		},
		listImages({},ref){
			return new Promise((resolve,reject) => {
				
			})
		}
	}
})


export default store