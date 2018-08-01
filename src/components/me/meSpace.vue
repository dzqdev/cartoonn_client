<template>
	<div class="meSpace">
		<x-header :left-options="{backText: ''}" style="background-color: #fff">
			<p style="color:#000">我的空间</p>
		</x-header>
		<div class="info">
			<div class="userInfo">
				<div class="username">
					{{user.user_name}}
				</div>			
				<div class="userImage">
					<img :src="user.user_img">
				</div>
			</div>
			<div class="attentionInfo">
				<div class="attentionCount">
					<div class="top">
						&nbsp;&nbsp;&nbsp;{{attentionCount}}
					</div>
					<div class="bottom">关注数</div>
				</div>
				<div class="addDesc"></div>
			</div>
		</div>
		<div class="other">
			<div class="meWatch">
				<div class="meWatchHeader">
				我最近在看
				</div>
				<div class="meWatchContainer">
					<divider>暂无记录</divider>
				</div>
			</div>
			
			
			<div class="mePublish">
				<div class="mePublishHeader">
					发表的话题
				</div>
				<div class="mePublish">
					<divider v-show="topicList.length == 0">暂无记录</divider>
					<div v-for="topic in topicList">
					<div class="topicItem" >
						<div class="topic_user">
							<img :src="topic.user_id.user_img">
							<div class="topic-username">{{topic.user_id.user_name}}</div>		
						</div>
						<div class="topic_content">
							{{topic.text_content}}
							<div class="msgImageBox" v-show="topic.image_content.length > 0 ">
                            	<img  v-for="image in topic.image_content" :src="image">
                        	</div>
						</div>
						<div class="topic_other_info">
							<div class="time">
								{{dateformat(topic.post_time)}}
							</div>
							<div class="comment-agree">
								 <div class="agree">
	                                <img src="static/agree.png">
	                                <div class="count">&nbsp;&nbsp;{{topic.comment.length}}</div>
	                            </div>

	                            <div class="comment">
	                                <img src="static/comment.png">
	                                    <div class="count">&nbsp;&nbsp;{{topic.comment.length}}</div>
	                            </div>
							</div>
						</div>
						
					</div>
					<div class="divide"></div>
				</div>
					
				</div>
			</div>
			
			<div class="meAttention">
				<div class="meAttentionHeader">
					关注动态
				</div>
				<div class="meAttentionContainer">
					<divider>暂无记录</divider>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { XButton,XHeader,Divider } from 'vux';
	export default{
		data(){
			return{
				attentionCount:0,
				topicList:'',
				user:''
			}
		},
		components: {
    		XHeader,
    		Divider
  		},
  		methods:{
  			init(){
  				var _this = this;
  				var userId = this.$route.params.userId;
                _this.axios.get('/user/meSpace/' + userId, {
                  params: {}
                })
                .then(function (response) {
                	console.log(response)
                	if(response.data.msg.attentionCount){
                		_this.attentionCount = response.data.msg.attentionCount.length;	
                	}else{
                		_this.attentionCount = 0;
                	}
                	
                	if(response.data.msg.topics){
                		for(let i = 0; i < response.data.msg.topics.length; i++){
                			response.data.msg.topics[i].user_id.user_img = _this.baseUrl + response.data.msg.topics[i].user_id.user_img;

                			if(response.data.msg.topics[i].image_content.length > 0){
	                			for(let j =0 ; j < response.data.msg.topics[i].image_content.length; j++){
	                				response.data.msg.topics[i].image_content[j] = _this.baseUrl + response.data.msg.topics[i].image_content[j];
	                			}
                			}
                		}
                	}
                	response.data.msg.user.user_img = _this.baseUrl + response.data.msg.user.user_img;

                	_this.user = response.data.msg.user;
                	_this.topicList = response.data.msg.topics;
                })
                .catch(function (err) {
                  console.log("err: " + err);
              });
  			}
  		},
  		mounted(){
  			this.init();
  		}
	}
</script>

<style scoped>
	.info{
		width: 100%;
		height: 200px;
		background-color: #FF9900;
		padding-left: 5%;
		padding-right: 5%;
	}

	.userInfo{
		width: 100%;
		height: 100px;
		float: left;
	}

	.userInfo .username{
		width: 70%;
		height: 100%;
		float: left;
		color: #fff;
		font-size: 22px;
		line-height: 100px;
		text-align: left;
	}

	.userInfo .userImage{
		max-width: 30%;
		height: 100%;
		float: left;
		padding-top: 25px;
	}	

	.userInfo .userImage img{
		width: 70px;
		height: 70px;
		border-radius: 50%;
	}

	.attentionInfo{
		width: 100%;
		height: 100px;
		float: left;
	}	

	.attentionCount{
		width: 100%;
		height: 50px;
		float: left;
		border-bottom: 1px solid #fff;
	}

	.attentionCount .top,.attentionCount .bottom{
		width: 100%;
		height: 25px;
		float: left;
		text-align: left;
		font-size: 16px;
		color: #fff;
	}

	.attentionCount .bottom{
		color: #555;
	}

	.other{
		width: 100%;
		height: 100%;
		margin-top: 20px;
	}

	.meWatchHeader,.mePublishHeader,.meAttentionHeader{
		width: 100%;
		height: 30px;
		font-size: 18px;
		color: #000;
		text-align: center;
		margin-bottom: 10px;
	}

	.topicItem{
		width: 90%;
		padding-left: 5%;
	}
	
	.topic_user{
		width: 100%;
		height: 60px;
		margin-bottom: 10px;
	}

	.topic_user img{
		width: 50px;
		height: 50px;
		float: left;
		margin-right: 10px;
		border-radius: 50%;
	}

	.topic-username{
		float: left;
		line-height: 40px;
		font-weight: bold;
		font-size: 18px;
	}

	.topic_content{
		text-align: left;
		line-height: 40px;
		font-weight: bold;
		font-size: 15px;
	}

	.msgImageBox {
	    margin-top: 10px;
	    overflow: hidden;
	}

	.msgImageBox img {
	    width: 30%;
	    max-height: 120px;
	    float: left;
	    margin-right: 10px;
	    margin-bottom: 10px;
	}

	.divide {
	    width: 100%;
	    height: 10px;
	    background-color: #efeff4;
	    float: left;
	}

	.topic_other_info{
		width: 100%;
		height: 30px;
	}
	
	.time{
		width: 70%;
		height: 30px;
		line-height: 30px;
		float: left;
		text-align: left;
		font-size: 14px;
	}

	.comment-agree{
		width: 30%;
		height: 30px;
		float: left;
		font-size: 14px;
	}

	.agree, .comment{
		width: 50%;
		height: 30px;
		float: left;
		padding-top: 5px;
	}

	.agree .count, .comment .count{
		line-height: 20px;
		float: left;
	}

	.agree img, .comment img{
		width: 20px;
		height: 20px;
		float: left;
	}

</style>