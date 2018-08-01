<template>
	<div id="communityDetail">
	<sticky
	        ref="sticky"
	        :check-sticky-support="false"
	        :disabled="disabled">
	       <x-header :left-options="{backText: ''}" style="background-color: #fff"><p style="color:#000">话题</p></x-header>
	      </sticky>
		 
		<div class="content" style="height:auto">
			<div class="userInfo">
				<span class="userImg">
					<img :src="user.user_img">
				</span>
				<span class="userName">{{user.user_name}}</span>
				<span class="attention">
					<!-- <x-button plain mini type="warn" style="border-radius:99px;float:right" v-show="user._id != getStorage.text._id">关注</x-button> -->
					<div class="alreayAgree" v-if="!isAgreeTopic"  @click="agreeTopic(topic._id)">
						<img src="/static/agree.png">{{topic.agree==''?0:topic.agree}}	
					</div>
					<div class="unAgree" v-if="isAgreeTopic" >
						<img src="/static/agree_active.png">
						<span style="display:inline-block;float:right">{{topic.agree}}</span>	
					</div>
				</span>
			</div>
			<div class="contentDetail">
				{{topic.text_content}}
			</div>
			<div class="imageDetail" v-if="hasImageContent">
				<img v-for="image in topic.image_content" :src="image">
			</div>
		</div>
		<div class="comment">
			<div class="commentHead">
				全部评论（{{commentList.length}}）
			</div>
			<div class="commentContainer" v-if="commentList != '' && commentList.length > 0">
				<div class="commentItem" v-for="comment in commentList">
					<div class="commentItemTop">
						<span class="commentItemTop-userImg">
							<img :src="comment.post_userid.user_img">
						</span>
						<span class="commentItemTop-userName">
							{{comment.post_userid.user_name}}
						</span>
						<span class="comment-agree">
							<img src="static/agree.png" v-if="comment.agreeUserList[0] == 'false'" @click="agree(comment._id)">
							<img src="static/agree_active.png" v-if="comment.agreeUserList[0] == 'true'">
							{{comment.agree}}
						</span>
					</div>
					<div class="commentItemBottom">
						{{comment.comment_content}}
					</div>
				</div>
			</div>
			<div class="commentContainer" v-if="commentList == '' && commentList.length == 0">
				<div class="msg">
					<div class="empty">
					</div>
					<div class="text">
						还没有评论哦!
					</div>
				</div>
			</div>
		</div>
		<div class="publish">
			<x-input placeholder="趁热来一发感想" v-model="comment">
        		<x-button mini slot="right" type="primary" @click.native = 'sendComment'>发送</x-button>
      		</x-input>
		</div>
	</div>
</template>

<script>
import { XButton,XInput,XHeader,Sticky,Popover,Previewer } from 'vux';
import {mapGetters} from 'vuex'
	export default{
		inject:['reload'],
		data(){
			return{
 				disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
 				//话题详情
 				topic:'',
 				//发表话题的用户信息
 				user:'',
 				//准备发送的评论
 				comment:'',
 				//返回的评论列表
 				commentList:'',
 				//是否包含图片
 				hasImageContent:false,
 				isAgreeTopic:false
			}
		},
		methods:{
			initDetail(topic_id){
				var _this = this;
				let userId = _this.getStorage.text._id;
                _this.axios.get('/topic/findByIdHaveComment/' + topic_id + '/' + _this.getStorage.text._id, {
                  params: {}
                })
                .then(function (response) {
                    if(response.data.msg.status == "ok"){

                    	//判断是否有图片内容并显示
                    	if(response.data.msg.topic.image_content.length > 0){
                    		//话题的图片的修改
	                    	for(let i = 0; i < response.data.msg.topic.image_content.length; i++){
	                    		response.data.msg.topic.image_content[i] = _this.baseUrl + response.data.msg.topic.image_content[i];
	                    	}
	                    	_this.hasImageContent = true;
                    	}else{
                    		_this.hasImageContent = false;
                    	}
                    	//获取当前用户是否评论该话题
                    	if(response.data.msg.topic.agree_list.indexOf(userId) > -1){
                    		_this.isAgreeTopic = true;
                    	}else{
                    		_this.isAgreeTopic = false;
                    	}

                    	//评论内容赋值
                       _this.topic = response.data.msg.topic;
                       //发表话题的用户的头像修改
                       response.data.msg.topic.user_id.user_img = _this.baseUrl + response.data.msg.topic.user_id.user_img;
                       //发表话题的用户
                       _this.user = response.data.msg.topic.user_id;
                       //为评论的用户的头像修改地址
                       if(response.data.msg.comment){
	                       	for(let j = 0; j < response.data.msg.comment.length; j++){
	                                response.data.msg.comment[j].post_userid.user_img = _this.baseUrl + response.data.msg.comment[j].post_userid.user_img;
	                        }
                       	_this.commentList = response.data.msg.comment;	
                       }
                    }
                    
                })
                .catch(function (err) {
                  console.log("err: " + err);
              });
			},
			//发送评论
			sendComment(){
				let _this = this;
				var url = '/topicComment/saveTopicComment'
				var params = new URLSearchParams();
				//用户id
				params.append('post_userid', _this.getStorage.text._id);
				// 话题id
				params.append('topic_id', _this.$route.params.topic_id); 
				//评论内容
				params.append('comment_content', _this.comment); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
				    if(res.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
				          text: '评论成功',
				          onHide () {
				          	_this.reload();
				          }
				        })
				    }else{
				    	_this.$vux.toast.show({
				          text: '评论失败'
				        })
				    }
				});
			},
			//为话题点赞
			agreeTopic(topic_id){
				let _this = this;
				let user_id = _this.getStorage.text._id;
				var url = '/topic/agreeTopic'
				var params = new URLSearchParams();
				params.append('topic_id', topic_id);
				params.append('user_id', user_id); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
				    if(res.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
				          text: '点赞成功',
				          onHide () {
				          	_this.reload();
				          }
				        })
				    }else{
				    	_this.$vux.toast.show({
				          text: '点赞失败'
				        })
				    }
				});
			},
			//为话题评论点赞
			agree(commentId){
				let _this = this;
				let user_id = _this.getStorage.text._id;
				 _this.axios.get('/topicComment/agree/' + commentId + '/' + user_id, {
                  params: {}
                })
                .then(function (response) {
                     if(response.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
				          text: '点赞成功',
				          onHide () {
				          	_this.$router.go(0);
				          }
				        })
				    }else{
				    	_this.$vux.toast.show({
				          text: '点赞失败'
				        })
				    }
                })
                .catch(function (err) {
                  console.log("err: " + err);
              });
			}
		},
		components:{
			XButton,
			XInput,
			XHeader,
			Sticky,
			Popover
		},
		mounted(){
			this.initDetail(this.$route.params.topic_id);
		},
		computed:{
			...mapGetters([
				'getStorage'
			])
		}
	}
</script>

<style scoped>
	.content{
		width: 90%;
		margin-left: 5%;
		height: auto;
	}

	.userInfo{
		width: 100%;
		height: 60px;
		padding-top: 10px;
		margin-bottom: 10px;
	}

	.userInfo span{
		display: inline-block;
		height: 40px;
		float: left;
	}

	.userImg{
		width: 40px;
		height: 40px;
		overflow: hidden;
	}

	.userImg img{
		width: 40px;
		height: 40px;
		border-radius: 40px;
	}

	.userName{
		width: 50%;
		line-height: 50px;
		font-size: 15px;
		margin-left: 10px;
		text-align: left;
	}

	.attention{
		width: 30%;
		padding-top: 10px;
	}

	.attention div{
		width: 100%;
		float: right;
		line-height: 30px;
		font-size: 16px;
		text-align: right;
	}

	.attention img{
		width: 30px;
		height: 30px;
		margin-right:5px;
	}


	.contentDetail{
		width: 100%;
		min-height: 30px;
		text-align: left;
		font-size: 16px;
	}

	.imageDetail{
		margin-top: 10px;
		min-height: 50px;
		width: 100%;
	}

	.imageDetail img{
		max-width: 50%;
	    height: 100px;
	    float: left;
	    margin-right: 10px;
	    margin-bottom: 5px;
	}

	.comment{
		width: 100%;
		margin-top: 20px;
		float: left;
	}

	.commentHead{
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #efefef;
		font-size: 14px;
		text-align: left;
		padding-left: 5%;
		color: #000;
	}

	.commentItem{
		width: 90%;
		margin-left: 5%;
		float: left;

	}

	.commentItemTop{
		width: 100%;
		height: 40px;
		padding-top: 10px;
	}

	.commentItemTop span{
		display: inline-block;
		height: 30px;
		float: left;

	}

	.commentItemTop-userImg{
		max-width: 20%;
		margin-right: 10px;
	}

	.commentItemTop-userImg img{
		width: 30px;
		height: 30px;
		border-radius: 50%;
		float: left;
	}

	.commentItemTop-userName{
		width: 60%;
		font-size: 14px;
		line-height: 30px;
		text-align: left;
	}

	.comment-agree{
		width: 20%;
		float: right;
		padding-top: 5px;
		line-height: 20px;
		font-size: 14px;
		text-align: left;
	}

	.comment-agree img{
		width: 20px;
		height: 20px;
		float: left;
		margin-right: 5px;
	}

	.commentItemBottom{
		width: 100%;
		padding-top: 10px;
		padding-bottom: 10px;
		text-align: left;
		font-size: 16px;
		border-bottom: 1px solid #eee;
	}

	.publish{
		width: 100%;
		height: 50px;
		position: fixed;
		bottom: 0;
		border-top: 1px solid #eee;
		background-color: #fff;
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