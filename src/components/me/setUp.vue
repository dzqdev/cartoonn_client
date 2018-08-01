<template>
	<div id="setUp">
		<x-header :left-options="{backText: ''}" style="background-color: #fff">
			<p style="color:#000">设置</p>
		</x-header>
		<div class="personalSetUp">
			<div class="header">
				个人设置
			</div>
			<group>
				<cell :title="'密码修改'" is-link :value-align="'left'"></cell>
				<cell :title="'头像修改'" :value-align="'left'" >
					<Upload :action="uploadPath" 
							:data="user_id"
							:show-upload-list="false"
							:on-success="handleSuccess"
        					:format="['jpg','jpeg','png']"
        					:headers="headers"
        					style="float: right">
				        <Button type="ghost" icon="ios-cloud-upload-outline">上传头像</Button>
				    </Upload>
				</cell>
			</group>
		</div>
		<div class="otherSetUp">
			<div class="header">
				其他设置
			</div>
			<group>
				<cell :title="'正在开发'" is-link :value-align="'left'"></cell>
			</group>
		</div>
		<div class="logout" @click="logout">退出登录</div>
		<div v-transfer-dom>
	      <confirm v-model="showConfirm"
	      :title="'是否退出登录'"
	      @on-confirm="onConfirm">
	        <p style="text-align:center;">确定?</p>
	      </confirm>
	  	</div>
	</div>
</template>

<script>
import { XButton,XHeader,Divider,Cell,Group,Actionsheet,Confirm,TransferDomDirective as TransferDom} from 'vux';
import {mapGetters,mapActions} from 'vuex'
	export default{
		directives: {
    		TransferDom
  		},
		data(){
			return{
				showConfirm:false
			}
		},
		methods:{
			onConfirm(){
				this.removeStorage();
				window.location.reload();
			},
			logout(){
				this.showConfirm = !this.showConfirm;
			},
			handleSuccess(res, file){
				console.log(res);
				let _this = this;
				//如果上传成功
				if(res.status == "ok" && res.img_url){
					//重新修改sessionStorage
					let originStorage = _this.getStorage;
					originStorage.text.user_img = res.img_url;
					_this.removeStorage();
					_this.set_storage(originStorage);
					_this.$vux.toast.show({
			          text: '修改成功',
			          onHide () {
			          	_this.$router.go(0);
			          }
				    })
				}else{
					_this.$vux.toast.show({
				      text: '修改失败'
				    })
				}
			},
			...mapActions([
				'removeStorage',
				'set_storage'
			])
		},
		components: {
    		XButton,
    		XHeader,
    		Divider,
    		Cell,
    		Group,
    		Actionsheet,
    		Confirm 
  		},
  		computed:{
  			...mapGetters([
  				'getStorage'
  			]),
			uploadPath:function(){
				return this.baseUrl + "/client/user/upload/image"
			},
			headers:function(){
				let user = JSON.parse(sessionStorage.getItem('user'));
				let head = {};
				head.Authorization = user.token;
				return head;
			},
			user_id:function(){
				return {"user_id":this.getStorage.text._id};
			}
  		}
	}
</script>

<style scoped>
	.header{
		width: 100%;
		height: 40px;
		line-height: 40px;
		font-size: 15px;
		text-align: left;
		padding-left: 5%;
		background-color: #efefef ;
	}

	.logout{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 40px;
		font-size: 16px;
		line-height: 40px;
		background-color: #fff;
		border-top: 1px solid #efefef;
	}
</style>