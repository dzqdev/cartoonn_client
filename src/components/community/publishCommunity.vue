<template>
	<div id="publishCommunity">
		<x-header :left-options="{backText: ''}" style="background-color: #fff">
			<p style="color:#000">发表话题</p>
			<!-- <x-button mini type="primary" @click.native="post" slot="right">发表</x-button> -->
			<div @click="post" slot="right" style="color:#FF9900">发表</div>
		</x-header>
		<group gutter="0">
	      <x-textarea :max="200" :placeholder="'这一刻的想法'" :height="200" v-model="text_area_value"></x-textarea>
	    </group>
	    <div>
	    	<div class="demo-upload-list" v-for="item in uploadList">
		        <template v-if="item.status === 'finished'">
		            <img :src="item.url">
		            <div class="demo-upload-list-cover">
		                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
		                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
		            </div>
		        </template>
    		</div>
	    </div>
	    <div>
	    	<Upload
	        ref="upload"
	        :show-upload-list="false"
	        :on-success="handleSuccess"
	        :format="['jpg','jpeg','png']"
	        :on-format-error="handleFormatError"
	        :before-upload="handleBeforeUpload"
	        :headers="headers"
	        :max-size="2048"
	        multiple
	        type="drag"
	        :action="uploadPath"
	        style="display: inline-block;width:88px;">
	        <div style="width: 88px;height:88px;line-height: 88px;">
	            <Icon type="camera" size="30"></Icon>
	        </div>
		    </Upload>
		    <Modal v-model="visible">
	        	<img :src="imgName" v-if="visible" style="width: 100%">
	    	</Modal>
	    </div>
	</div>
</template>

<script>
import { XTextarea, Group,XHeader,XButton  } from 'vux';
import {mapGetters} from 'vuex';
	export default{
		data(){
			return{
				text_area_value:'',
				uploadList: [],
				imgName: '',
                visible: false,
			}
		},
		components:{
			XTextarea, Group,XHeader,XButton
		},
		methods:{
			onEvent (event) {
			    console.log('on', event)
			},
			post(){
				let _this = this;
				//获取图片数组
				let imageUploadList = [];

				for(let i = 0; i < _this.uploadList.length; i++){
					imageUploadList.push(_this.uploadList[i].response.params.img_url);
				}

				var url = '/topic/saveTopic'
				var params = new URLSearchParams();
				params.append('user_id', _this.getStorage.text._id);
				params.append('text_content', _this.text_area_value); 
				params.append('image_content',JSON.stringify(imageUploadList));
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
					console.log(res);
				    if(res.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
				          text: '发表成功',
				          onHide () {
				          	_this.$router.go(-1);
				          }
				        })
				    }else{
				    	_this.$vux.toast.show({
				          text: '发表失败'
				        })
				    }
				});
			},
			handleSuccess (res, file) {
				file.url = this.baseUrl + res.params.img_url;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '图片格式错误',
                    desc: '图片 ' + file.name + ' 格式错误, 请上传jpg或png.'
                });
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传5张图片'
                    });
                }
                return check;
            }
		},
		computed:{
			...mapGetters([
				'getStorage'
			]),
			uploadPath:function(){
				return this.baseUrl + "/client/topic/upload/image"
			},
			headers:function(){
				let user = JSON.parse(sessionStorage.getItem('user'));
				let head = {};
				head.Authorization = user.token;
				return head;
			}
		},
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
	}
</script>

<style scoped>
	#publishCommunity{
		padding: 0;
		margin: 0;
	}

	.demo-upload-list{
        display: inline-block;
        width: 80px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: auto;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }

    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
</style>