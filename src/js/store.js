import Vue from 'vue'
import Vuex from 'vuex'
import auth from './store-auth'
import imagesDatabase from './store-imagesdatabase'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		authModule: auth,
		imagesDataModlue: imagesDatabase
	}
})


export default store