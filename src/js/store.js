import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		loading: false,
		isLogin: false
	},
	getters: {
		loading: state => {
			return state.loading;
		},
		auth: state => {
			return state.isLogin;
		}
	},
	mutations: {
		finishLoad(state) {
			state.loading = true;
		},
		auth(state, user) {
			state.isLogin = user;
		}
	},
	actions: {
		userLogIn({commit }) {
			commit('auth', true);
			commit('finishLoad');
		},
		userLogOut({commit }) {
			commit('auth', false);
			commit('finishLoad');
		}
	}
})


export default store