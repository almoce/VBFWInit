import Vue from 'vue'
import Router from 'vue-router'
import {store} from './api.js'

// VIEW MODULE
import{App, Nav, Login, Upload} from '../view'

Vue.component('nav-bar', Nav)

Vue.use(Router);

const router = new Router({
	mode: 'history',
	routes: [{
		path:'/upload',
		name:'upload',
		component: Upload,
		beforeEnter:(to, from, next) =>{
			store.dispatch('imagesDataModlue/dataInit').then(()=>{
				next();
			});
		}
	},{
		path: '/login',
		name:'login',
		component: Login
	}, {
		path: '/logout',
		name:'logout',
		beforeEnter:(to, from, next)=>{
			store.dispatch('authModule/userLogOut').then(()=>{
			})
			next('home');
		}
	},{
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
	store.dispatch('authModule/authCheck').then(() => {		
		if(protectedRouterNames.indexOf(to.name) != -1){
			if(store.getters['authModule/auth']){
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
