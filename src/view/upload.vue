<template>
	<div class="container">
		<div class="row">
			<div class="col">
				<h1>{{title}}</h1>
			</div>
		</div>
		<form @submit.prevent="upload">
			<div class="row">
				<div class="col">
					<div class="form-group">
						<label for="selectImage"><span class="btn btn-secondary">Select Images</span></label>
						<input id="selectImage" type="file" class="form-control" accept="image/*" multiple @change="imagefile($event, true)">
					</div>
				</div>
				<div class="col">
					<div class="form-group">
						<label for="addImage"><span class="btn btn-secondary">Add Images</span></label>
						<input id="addImage" type="file" class="form-control" accept="image/*" multiple @change="imagefile($event, false)">
					</div>
				</div>
				<div class="col">
					<button class="btn btn-primary" type="submit">Upload</button>
				</div>
			</div>
		</form>
		<div class="row">
			<div class="col">
				<div class="preview" v-if="files">
					<img :src="img" alt="" class="img-thumbnail" v-for="img in files">
				</div>
			</div>
		</div>
	</div>
</template>


<script>
	import {store} from '../js/api.js';

	export default {
		name: 'upload',
		store,
		data(){
			return {
				title: 'Upload Images',
				files: [],
				rowFile: []
			}
		},
		methods:{
			imagefile(e, reset){
				let vm = this;
				if(e.target.files.length){
					if(reset){
						vm.files = [];
						vm.rowFile;
					}
					for (var i = e.target.files.length - 1; i >= 0; i--) {
						vm.rowFile.push(e.target.files[i]);
						let reader  = new FileReader();
						reader.readAsDataURL(e.target.files[i]);
						reader.addEventListener('load', () => {
							vm.files.push(reader.result);
						})
					}
				}
			},
			upload(){
				this.rowFile.forEach((file)=>{
					this.$store.dispatch('imageUpload', file).then((sp)=>{
						console.log(sp);
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	input[type='file']{
		display:none;
	}
	.preview{
		img{
			// max-width:300px;
		}
	}
</style>