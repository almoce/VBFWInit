import Vue from 'vue'
import Router from 'vue-router'

// VIEW MODULE
import{App, Login} from '../view'


Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [{
		path: '/login',
		name:'login',
		component: Login
	}, {
		path: '/',
		name: 'home',
		component: App
	}, {
		path: '*',
		redirect: '/'
	}]
})


export default router;
