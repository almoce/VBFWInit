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
							<div v-if="uploadingFolder == key">
								<button v-if="uploadProgress === 0 || uploadProgress === 100" class="btn btn-outline-danger btn-sm" @click.stop="deleteFolder(key)">Delete Folder</button>
								<div class="progress" v-else>
								  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width': uploadProgress + '%'}" ></div>
								</div>	
							</div>
							<div v-else>
								<button class="btn btn-outline-danger btn-sm" @click.stop="deleteFolder(key)">Delete Folder</button>
							</div>
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
				<form @submit.prevent="renameFolder($event)">
					<div class="input-group">
						<span class="input-group-btn">
							<div class="btn-group">
								<button class="btn btn-secondary" type="button" @click="gotoFolder(null)">Back</button>
								<button class="btn btn-secondary" type="submit">Rename</button>
							</div>
						</span>
						<input type="text" class="form-control" v-bind:value="folderName">
					</div>
				</form>
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
		<div class="row" v-if="files.length > 0">
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
				newFolderName: '',
			}
		},
		computed:{
			folders(){
				return this.$store.state.imagesDataModlue.folder_system;
			},
			folderName(){
				return this.$store.state.imagesDataModlue.location.name;
			},
			subfolder(){
				return this.$store.state.imagesDataModlue.location.key;
			},
			subfolderImages(){
				return this.$store.state.imagesDataModlue.sub_folder_images;
			},
			uploadProgress(){
				return this.$store.state.imagesDataModlue.uploadProgress.percentage;
			},
			uploadingFolder(){
				return this.$store.state.imagesDataModlue.uploadProgress.folder_key;
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
				this.$store.dispatch('imagesDataModlue/imageUpload', this.files).then(()=>{
					this.files = [];
				})
			},
			createFolder(){
				if(this.newFolderName.length){
					this.$store.dispatch('imagesDataModlue/createFolder', this.newFolderName).then(()=>{
						this.newFolderName = '';
					});
				}
			},
			renameFolder(e){
				let name = e.target.querySelector('input').value;
				if(name){
					this.$store.dispatch('imagesDataModlue/renameFolder', name);
				}
			},
			deleteFolder(key){
				if(confirm("Are you sure?")){
					this.$store.dispatch('imagesDataModlue/deleteFolder', key);
					if(key === this.subfolder){
						this.gotoFolder(null);	
					}
				}
			},
			gotoFolder(key, name){
				let data = {
					key:key,
					name:name
				}
				data = data.key ? data:null;
				this.$store.dispatch('imagesDataModlue/changeLocation', data);
			}
		}
	}
</script>

<style lang="scss">
	.progress-bar{
		transition: all 0.2s;
	}
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
		min-width:150px;
	}
	.preview{
		border:1px dashed #ccc;
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