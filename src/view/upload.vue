<template>
	<div class="container">
		<div class="row">
			<div class="col">
				<h1>{{title}}</h1>
			</div>
			<div class="col text-right">
				<router-link to="/"><button class="btn btn-secondary">Back to Home</button></router-link>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<div class="d-flex flex-row flex-wrap">
					<div class="bg-faded card" v-for="(folder, key) in folders" v-bind:class="{'bg-inverse text-white': subfolder == key}">
						<div class="card-block" @click="gotoFolder(key, folder.name)">
							<h4 class="card-title">{{folder.name}}</h4>
							<p class="card-text">{{folder.count}} Files</p>
							<button class="btn btn-outline-danger btn-sm" @click.stop="deleteFolder(key)">Delete Folder</button>
						</div>
					</div>	
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col" v-if="!subfolder">
				<form @submit.prevent="createFolder">
					<div class="input-group">
						<span class="input-group-btn">
							<button class="btn btn-secondary" v-bind:class="{'disabled': newFolderName.length == 0}" type="submit">Create Folder</button>
						</span>
						<input type="text" class="form-control" placeholder="Create New Folder Name" v-model="newFolderName">
					</div>
				</form>
			</div>
			<div class="col" v-else>
				<div class="input-group">
					<span class="input-group-btn">
						<button class="btn btn-secondary" type="button" @click="gotoFolder(null)">Back</button>
					</span>
					<input type="text" class="form-control" readonly v-bind:value="location">
				</div>
			</div>
		</div>
		<br>
		<div class="row" v-if="subfolder">
			<div class="col">
				<form @submit.prevent="upload">
					<div class="d-flex flex-row">
						<div class="form-group">
							<label for="addImage"><span class="btn btn-secondary">Add Images</span></label>
							<input id="addImage" type="file" class="form-control" accept="image/*" multiple @change="imagefile($event, true)">
						</div>
						<div class="form-group">
							<button class="btn btn-secondary" type="button" @click="imagefile($event, false)">Clearn Upload</button>
						</div>
						<div class="form-group">
							<button class="btn btn-primary" type="submit">Upload</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<br>
		

		<div class="row" v-if="files">
			<div class="col">
				<div class="preview">
					<div class="d-flex  align-items-start flex-wrap">
						<img :src="img.data" alt="" class="img-thumbnail" v-for="img in files">
					</div>
				</div>
			</div>
		</div>

		<div class="row" v-if="subfolderImages">
			<div class="col">
				<div class="folder-image">
					<div class="d-flex  align-items-start flex-wrap">
						<img :src="img.url" alt="" class="img-thumbnail" v-for="img in subfolderImages">
					</div>
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
				newFolderName: ''
			}
		},
		computed:{
			folders(){
				return this.$store.state.imagesDataModlue.folder_system;
			},
			location(){
				return this.$store.state.imagesDataModlue.location.name;
			},
			subfolder(){
				return this.$store.state.imagesDataModlue.location.key;
			},
			subfolderImages(){
				return this.$store.state.imagesDataModlue.sub_folder_images;
			}
		},
		methods:{
			imagefile(e, image){
				let vm = this;
				if(!image){
					vm.files = [];
					document.querySelector('#addImage').value = null;
				} else {
					if(e.target.files.length){
						for (var i = e.target.files.length - 1; i >= 0; i--) {
							let file = e.target.files[i];
							let data = {
								name: file.name,
								file: file,
								data:'',
							}
							let reader  = new FileReader();
							reader.readAsDataURL(file);
							reader.addEventListener('load', () => {
								data.data = reader.result;
								vm.files.push(data)
							})
						}

					}	
				}
			},
			upload(){
				this.files.forEach((file)=>{
					this.$store.dispatch('imagesDataModlue/imageUpload', file.file).then((sp)=>{
					})
				})
				this.files = [];
			},
			createFolder(){
				if(this.newFolderName.length){
					this.$store.dispatch('imagesDataModlue/createFolder', this.newFolderName).then(()=>{
						this.newFolderName = '';
					});
				}
			},
			deleteFolder(key){
				if(confirm("Are you sure?")){
					this.$store.dispatch('imagesDataModlue/deleteFolder', key);
					this.gotoFolder(null);	
				}
			},
			gotoFolder(key, name){
				let data = {
					key:key,
					name:name
				}
				this.$store.dispatch('imagesDataModlue/changeLocation', data);
			}
		}
	}
</script>

<style lang="scss">
	input[type='file']{
		display:none;
	}
	.form-group{
		margin-right:10px;
	}
	.card{
		margin-right:10px;
		margin-bottom:10px;
		cursor:pointer;
	}
	.preview{
		background:#f2f2f2;
		img{
			max-width:10%;
			margin:15px;
		}
	}
	.folder-image{
		background:#f2f2f2;
		img{
			max-width:30%;
			margin:15px;
		}
	}
</style>