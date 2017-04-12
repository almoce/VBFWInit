<template>
	<div class="container">
		<h1 class="text-center">{{message}}</h1>
		<section class="icons">
			<div class="row">
				<div class="col text-center">
					<img class="big" src="/assets/webpack.png" alt="">
				</div>
			</div>
			<div class="row">
				<div class="col"></div>
				<div class="col"></div>
				<div class="col text-center">
					<img class="small" src="/assets/vue.png" alt="">
				</div>
				<div class="col text-center">
					<img class="small" src="/assets/firebase.png" alt="">
				</div>
				<div class="col text-center">
					<img class="small" src="/assets/bootstrap.png" alt="">
				</div>
				<div class="col"></div>
				<div class="col"></div>
			</div>
		</section>
		<div class="text-center">
			<router-link to="/login"><button class="btn btn-primary">Go to Login</button></router-link>
		</div>
	</div>
</template>


<script>
	export default {
		name: 'index',
		data(){
			return {
				message: 'Hello Master'
			}
		}
	}
</script>


<style lang="scss" scoped>
.container{
	padding-top:50px;
}
.icons{
	padding: 30px 0px;
	.row{
		padding:10px 0px;
	}
	img{
		&.big{
			width:100px;
		}
		&.small{
			width:50px;
		}
	}
}

</style>