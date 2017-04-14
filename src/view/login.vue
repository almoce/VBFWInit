<template>
	<div class="container">
		<div class="row align-items-center" v-if="!auth">
			<div class="col">
				<h1>{{title}}</h1>
				<br>
				<form @submit.prevent="login" novalidate>
					<div class="form-group" >
						<label for="email">Email</label>
						<input type="email" class="form-control" v-model="email">
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" class="form-control" v-model="password">
					</div>
					<div class="text-danger">
						<p v-if="erro">{{erro}}</p>
						<p class="noselect" v-else> 	&nbsp; </p>
					</div>
					<button type="submit" class="btn btn-primary">
						Login
					</button>
				</form>
			</div>
		</div>
		<div class="row align-items-center" v-else>
			<div class="col">
				<h1>Welcome</h1>
				<button class="btn btn-primary" @click="logout">
					Logout
				</button>
				<router-link to="/upload"><button class="btn btn-success">Go to Upload</button></router-link>
			</div>			
		</div>
	</div>
</template>


<script>
	import {store} from '../js/api.js';

	export default{
		name: 'login',
		store,
		data(){
			return {
				'title': 'Login',
				'erro': '',
				'email':'',
				'password': ''
			}
		},
		computed:{
			auth(){
				return this.$store.getters['authModule/auth'];
			}
		},
		methods:{
			login(){
				this.erro = '';
				this.$store.dispatch('authModule/userLogIn', {email:this.email, password:this.password}).then((erro) => {
					this.erro = erro;
				})
			},
			logout(){
				this.$store.dispatch('authModule/userLogOut').then((erro)=>{
					this.erro = erro;
				})
			}
		}
	}
</script>

<style scoped>
	.container{
		max-width: 450px;
	}
</style>