<template>
	<div id="register">
		<div id="top">
			<img src="static/fav_icon.png">
		</div>
		 <div style="width: 80%;margin-left: 10%;padding-top: 10px">
		      <step v-model="step" background-color='#fbf9fe'>
		        <step-item title="获取验证码"></step-item>
		        <step-item title="信息完善"></step-item>
		      </step>
		    </div>
		<group v-show="step == 0">
      		<x-input placeholder="输入手机号码" v-model="phone" is-type="china-mobile" keyboard="number" :max="11" >
      			<img slot="label" style="display:block;margin-right: 20px;" src="static/phone.png" width="20" height="20">
      		</x-input>
      		 <x-input class="weui-vcode" placeholder="输入验证码" v-model="code">
      		 	<img slot="label" style="display:block;margin-right: 20px;" src="static/checkcode.png" width="20" height="20">
		        <x-button slot="right" type="primary" mini @click.native="sendSMS" :disabled="disabled">{{btnText}}</x-button>
		    </x-input>
		    <br>
		    <div class="btn_wrap">
		        <x-button type="primary" @click.native="nextStep">下一步</x-button>
		      </div>
      		<div class="login">
      			已有账号? <span style="color:#2d8cf0" @click="login">去登录</span>
      		</div>
    	</group>

    	<group v-show="step == 1">
      		<x-input placeholder="输入用户名" v-model="username">
      			<img slot="label" style="display:block;margin-right: 20px;" src="static/username.png" width="20" height="20">
      		</x-input>
      		 <x-input class="weui-vcode" placeholder="输入密码" v-model="password" type="password">
      		 	<img slot="label" style="display:block;margin-right: 20px;" src="static/password.png" width="20" height="20">
		    </x-input>
		     <x-input class="weui-vcode" placeholder="确认密码" v-model="confirmPassword" type="password">
      		 	<img slot="label" style="display:block;margin-right: 20px;" src="static/password.png" width="20" height="20">
		    </x-input>
		    <br>
		    <div class="btn_wrap">
		        <x-button type="primary" @click.native="nextStep">确认注册</x-button>
		    </div>
		    <div class="login">
      			已有账号? <span style="color:#2d8cf0" @click="login">去登录</span>
      		</div>
    	</group>
	</div>
</template>

<script>
import { XInput, Group, XButton, Cell,Toast, Step, StepItem, Msg } from 'vux'
export default{
	data(){
		return{
			username:'',
			phone:'',
			code:'',
			password:'',
			confirmPassword:'',
			step: 0,
			disabled:false,
			time:60
		}
	},
	methods:{
		sendSMS(){
			//发送验证码
			let _this = this;
			if(_this.phone == ''){
				_this.$vux.toast.show({
					width:'11em',
					type:'cancel',
			        text: '请输入手机号码'
				})
			}else{
				if(_this.isPoneAvailable(_this.phone)){
					var url = '/user/register/sendSMS'
					var params = new URLSearchParams();
					params.append('phone', _this.phone);
					_this.axios({
					    method: 'post',
					    url:url,
					    data:params
					}).then((res)=>{
					    if(res.data.status == "ok"){
					    	_this.$vux.toast.show({
					          text: '发送成功'
						    })
						    _this.disabled = true;
							_this.timer();
					    }else if(res.data.status == "exits"){
					    	_this.$vux.toast.show({
					    		width:'11em',
					    		type:'cancel',
					        	text: '该号码已经注册!!'
						    })
					    }else{
					    	_this.$vux.toast.show({
					    		type:'cancel',
					        	text: '发送失败'
						    })
					    }
					});
				}else{
					_this.$vux.toast.show({
			    		type:'cancel',
			    		width:'11em',
			        	text: '不是正确的手机号码'
					})
				}
			}
		},
		//注册
		register(){
			let _this = this;

			//判断两次输入是否一致
			if(_this.password != _this.confirmPassword){
				_this.$vux.toast.show({
					type:'cancel',
					width:'11em',
		          	text: '两次输入密码不一致'
			   })
			}else{
				var url = '/user/register'
				var params = new URLSearchParams();
				params.append('user_name', _this.username);
				params.append('user_password', _this.password); 
				params.append('user_phone', _this.phone); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
				    if(res.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
				          	text: '注册成功',
					        onHide () {
					       		_this.$router.push('/');
					        }
					   })
				    }else{
						_this.$vux.toast.show({
							type:'cancel',
				          	text: '注册失败'
					   })
				    }
				});
			}
		},
		//点击验证码进入下一步
		nextStep () {
			let _this = this;
			if(_this.step < 1){
				//检查验证码是否正确，从而确定是否进入下一步
				if(_this.code == '' || _this.phone ==''){
					_this.$vux.toast.show({
			    		type:'cancel',
			    		width:'11em',
		          		text: '请先填写注册信息'
			    	})
				}else{
					var url = '/user/register/checkCode'
					var params = new URLSearchParams();
					params.append('phone', _this.phone);
					params.append('code', _this.code); 
					_this.axios({
					    method: 'post',
					    url:url,
					    data:params
					}).then((res)=>{
					    if(res.data.status == "ok"){
					    	_this.step ++;
					    }else{
					    	_this.$vux.toast.show({
					    		type:'cancel',
					    		width:'11em',
				          		text: '验证码错误或过期'
					    	})
					    }
					});
				}
				// _this.step ++;
			}else{
				_this.register();
			}
    	},
    	//跳转到登录页面
    	login(){
			this.$router.push('/me/login');
    	},
    	isPoneAvailable(poneInput) {  
          var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
          if (!myreg.test(poneInput)) {  
              return false;  
          } else {  
              return true;  
          }  
      	},
      	timer() {
           if(this.time > 1) {
               this.time--;
               setTimeout(this.timer, 1000);
           }else{
           		this.disabled = false;
           }
        }
	},
	components: {
		XInput,
		Group,
		XButton,
		Cell,
		Toast,
		Step,
		StepItem,
		Msg
	},
    computed: {
        btnText: function () {
            return this.time > 0 && this.disabled ? this.time + 's 后重新获取' : '获取验证码';
        }
    }
}
</script>

<style scoped>
	#register{
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

	.login{
		position: fixed;
		bottom: 10px;
		text-align: center;
		padding-left: 30%;
	}
</style>