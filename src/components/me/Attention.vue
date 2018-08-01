<template>
	<div id="attention">
		<x-header :left-options="{backText: ''}" style="background-color: #fff">
			<p style="color:#000">我关注的大神</p>
		</x-header>
		<div class="attention-item" v-for="attentionUser in attentionUserList" v-if="attentionUserList.length > 0">
			<div class="attention-image">
				<img :src="attentionUser.user_img"/>
			</div>
			<div class="attention-other">
				<div class="attention-info">
					<div class="attention-info-top">
						{{attentionUser.user_name}}
					</div>					
					<div class="attention-info-bottom">
						动态消息
					</div>					
				</div>
				<div class="attention-button">
					<x-button mini plain style="border-radius:20px;" @click.native="cancelAttention(attentionUser._id)">已关注</x-button>
				</div>
			</div>
		</div>
		<div class="msg" v-if="attentionUserList.length == 0">
			<div class="empty">
			</div>
			<div class="text">
				还没有关注的TA
			</div>
		</div>
	</div>
</template>

<script>
import { XButton,XHeader } from 'vux';
import {mapGetters} from 'vuex'
	export default{
		inject:['reload'],
		data(){
			return{
				attentionUserList:''
			}
		},
		methods:{
			init(currentUser){
				var _this = this;
                _this.axios.get('/user/findAttentionUser/' + currentUser, {
                  params: {}
                })
                .then(function (response) {
                	for(let i = 0; i < response.data.msg.text.attention_user.length; i++){
                		console.log(response.data.msg.text.attention_user[i]);
                		response.data.msg.text.attention_user[i].user_img = _this.baseUrl + response.data.msg.text.attention_user[i].user_img;
                	}
                    _this.attentionUserList = response.data.msg.text.attention_user;
                })
                .catch(function (err) {
                  console.log("err: " + err);
              });
			},
			cancelAttention(attentionId){
				let _this = this;
				let currentUser = this.getStorage.text._id;
				var url = '/user/cancelAttentionUser'
				var params = new URLSearchParams();
				params.append('attentionId', attentionId);
				params.append('userId', currentUser); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
					console.log("res",res);

				    if(res.data.msg.status == "ok"){
						_this.$vux.toast.show({
                        	text: '取消成功',
					        onHide () {
					         _this.reload();
					        }
                        })
				    }else{
				    	console.log("取消失败");
				    }
				});
			}
		},
		mounted(){
			//获取用户id
			let currentUser = this.getStorage.text._id;
			this.init(currentUser);
		},
		components: {
    		XButton,
    		XHeader 
  		},
  		computed:{
  			...mapGetters([
  				'getStorage'
  			])
  		}
	}
</script>

<style scoped>
	.attention-item{
		width: 100%;
		height: 80px;
		padding: 10px;
	}

	.attention-image{
		width: 20%;
		height: 60px;
		float: left;
	}

	.attention-image img{
		width: 50px;
		height: 50px;
		border-radius: 50%;
		box-shadow: 1px 1px 1px rgba(255, 165, 0,.4);
    	border:2px solid rgba(255, 165, 0,.3);
	}

	.attention-other{
		width: 80%;
		height: 60px;
		float: left;
		border-bottom: 1px solid #efefef;
	}

	.attention-info{
		width: 70%;
		height: 100%;
		float: left;
	}

	.attention-info-top{
		width: 100%;
		height: 30px;
		text-align: left;
		line-height: 30px;		
		color: #000;
		font-size: 16px;
	}

	.attention-info-bottom{
		width: 100%;
		height: 30px;
		text-align: left;
		line-height: 30px;	
		color: #999;
		font-size: 12px;
	}

	.attention-button{
		width: 30%;
		height: 100%;
		float: left;
		font-size: 12px;
		padding-top: 10px;
	}

	.msg{
		margin-top: 100px;
	}

	.empty{
		width: 250px;
		height: 150px;
		margin: 0 auto;
		overflow: hidden;
		background: url('/static/empty.jpg') no-repeat -20px -20px;
	}

	.text{
		width: 250px;
		margin: 0 auto;
		font-size: 16px;
		color: #666;
	}

</style>