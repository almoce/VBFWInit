import {firebaseApi} from './api.js'

const auth = {
	namespaced: true,
	state: {
		auth: false
	},
	getters: {
		auth(state){
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
	}
}

export default auth