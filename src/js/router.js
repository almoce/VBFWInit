import Vue from 'vue'
import Router from 'vue-router'
import {store} from './api.js'

// VIEW MODULE
import{App, Login, Upload} from '../view'


Vue.use(Router);

const router = new Router({
	mode: 'history',
	routes: [{
		path:'/upload',
		name:'upload',
		component: Upload
	},{
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

const protectedRouterNames = ['upload']

router.beforeEach((to, from, next) => {
	store.dispatch('authCheck').then(() => {		
		if(protectedRouterNames.indexOf(to.name) != -1){
			if(store.getters.auth){
				next()
			} else {
				next('login')
			}
		} else {
			next();
		}
	});
})


export default router;
