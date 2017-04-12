<template>
	<div class="container" v-if="loading">
		<div class="row align-items-center" v-if="!auth">
			<div class="col">
				<h1>{{title}}</h1>
				<br>
				<form @submit.prevent="login">
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
			</div>			
		</div>
	</div>
</template>


<script>
	import {store, firebaseApi} from '../js/api.js';

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
				return this.$store.getters.auth;
			},
			loading(){
				return this.$store.getters.loading;
			}
		},
		methods:{
			login(){
				this.erro = '';
				firebaseApi.signInWithEmail(this.email, this.password, (erro) => {
					return this.erro = erro;
				})
			},
			logout(){
				firebaseApi.signOut((erro)=>{
					console.log(erro);
				});
			}
		}
	}
</script>

<style scoped>
	.container{
		max-width: 450px;
	}
	.row{
		height: 100vh;
		
	}
</style>