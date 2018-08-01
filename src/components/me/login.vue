<template>
	<div id="login" >
		<div id="top">
			<img src="static/fav_icon.png">
		</div>
		<group>
      		<x-input v-model="phone" placeholder="手机号码">
      			<img slot="label" style="display:block;margin-right: 20px;" src="static/phone.png" width="20" height="20">
      		</x-input>
      		<x-input placeholder="" :min="2" :max="5" v-model="password" placeholder="输入密码" type="password">
      			<img slot="label" style="display:block;margin-right: 20px;" src="static/password.png" width="20" height="20">
      		</x-input>
      		<br>
		    <x-button type="primary" action-type="button" @click.native="login">登录</x-button>
      		<toast v-model="success" text="登录成功" :time="1000"></toast>
      		<toast v-model="fail" text="手机号码或密码错误"  type="cancel" :time="1000"></toast>
      		<div class="reg">
      			没有账号? <span style="color:#2d8cf0" @click="reg">去注册</span>
      		</div>
    	</group>
	</div>
</template>

<script>
import { XInput, Group, XButton, Cell,Toast } from 'vux'
import {mapGetters,mapActions} from 'vuex'
export default{
	data(){
		return{
			phone:'',
			password:'',
			success:false,
			fail:false
		}
	},
	methods:{
		login(){
			let _this = this;
			if(_this.phone == '' || _this.password ==''){
				_this.$vux.toast.show({
		    		type:'cancel',
		    		width:'11em',
	          		text: '请先手机号码和密码'
		    	})
			}else{
				var url = '/user/login'
				var params = new URLSearchParams();
				params.append('user_phone', _this.phone);
				params.append('user_password', _this.password); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
				    if(res.data.msg.status == "ok"){
				    	_this.success = true;
				    	//修改状态
				    	_this.$store.dispatch('set_storage',res.data.msg);
				    	// _this.$router.push('/');
				    	setTimeout(function(){
				    		_this.$router.replace({
	                			path: '/'
	            			})
				    	},1000)
				    }else{
						_this.fail = true;
				    }
				});
			}
		},
		reg(){
			this.$router.push('/me/register');
		}
	},
	components: {
		XInput,
		Group,
		XButton,
		Cell,
		Toast
	},
	computed:{
		getWindowHeight(){
			return $(window).height();
		}
	}
}
</script>

<style scoped>
	#login{
		height: 700px;
	}
	#top{
		width: 100%;
		height: 260px;
		border-bottom: 1px solid #ccc;
	}
	#top img{
		width: 100px;
		height: 100px;
		margin-top: 65px;
	}

	.reg{
		position: fixed;
		bottom: 10px;
		text-align: center;
		padding-left: 30%;
	}
</style>