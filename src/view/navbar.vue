<template>
    <nav class="navbar navbar-toggleable-md navbar-inverse bg-primary">
        <router-link class="navbar-brand" to="/">
            <img src="/assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
	     	VFWB
        </router-link>
        <div class="collapse navbar-collapse" id="navbarNav">
	        <ul class="navbar-nav">
	        	<router-link to="/"  class="nav-item" tag="li" active-class="active" exact>
	        		<a class="nav-link" href="#">Home</a>
	        	</router-link>
	        	<router-link to="/login"  class="nav-item" tag="li" active-class="active">
	        		<a class="nav-link" href="#" v-if="!auth">Login</a>
	        		<a class="nav-link" href="#" v-if="auth">Me</a>
	        	</router-link>

	        	<router-link to="/upload" class="nav-item" tag="li" active-class="active">
	        		<a class="nav-link" v-bind:class="{disabled: !auth}" href="#">Upload</a>
	        	</router-link>
	        </ul>
        </div>
	</nav>

</template>

<script>
	import {store} from '../js/api.js';

	export default{
		name:'navbar',
		store,
		data(){
			return{
				title: 'VBFW'
			}
		},
		computed:{
			auth(){
				return this.$store.getters['authModule/auth'];
			}
		},
	}
</script>

<style lang="scss" scoped>

</style>