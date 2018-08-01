<template>
	<div id="mtTopic">
		<x-header :left-options="{backText: ''}" style="background-color: #fff">
			<p style="color:#000">我的话题</p>
		</x-header>
		<div class="mePublish">
			<div class="mePublishContainer">
				<div class="msg" v-if="topicList.length == 0">
					<div class="empty">
					</div>
					<div class="text">
						一个话题都没有
					</div>
				</div>
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
                                <div class="count">&nbsp;&nbsp;{{topic.agree}}</div>
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
	</div>
</template>

<script>
import { XButton,XHeader,Divider } from 'vux';
import {mapGetters} from 'vuex'
	export default{
		data(){
			return{
				topicList:''
			}
		},
		methods:{
			init(){
  				var _this = this;
  				var userId = this.$route.params.userId;
  				console.log(userId);
                _this.axios.get('/user/meTopic/' + userId, {
                  params: {}
                })
                .then(function (response) {
                	console.log(response);
                	for(let i = 0; i < response.data.msg.text.length; i++){
                		//每一项的用户头像
                		response.data.msg.text[i].user_id.user_img = _this.baseUrl + response.data.msg.text[i].user_id.user_img;

                		if(response.data.msg.text[i].image_content.length > 0){
                			for(let j =0 ; j < response.data.msg.text[i].image_content.length; j++){
                				response.data.msg.text[i].image_content[j] = _this.baseUrl + response.data.msg.text[i].image_content[j];
                			}
                		}
                	}
                	_this.topicList = response.data.msg.text;
                })
                .catch(function (err) {
                  console.log("err: " + err);
              });
  			}
		},
		components: {
    		XButton,
    		XHeader,
    		Divider
  		},
  		computed:{
  			...mapGetters([
  				'getStorage'
  			])
  		},
  		mounted(){
  			this.init();
  		}
	}
</script>

<style scoped>
	.topicItem{
		width: 90%;
		padding-left: 5%;
		padding-top: 10px;
	}
	
	.topic_user{
		width: 100%;
		height: 40px;
		margin-bottom: 10px;
	}

	.topic_user img{
		width: 45px;
		height: 45px;
		border-radius: 50%;
		float: left;
		margin-right: 10px;
		box-shadow: 1px 1px 1px rgba(255, 165, 0,.4);
    	border:2px solid rgba(255, 165, 0,.3);
	}

	.topic-username{
		float: left;
		line-height: 40px;
		font-weight: bold;
		font-size: 18px;
		margin-left: 10px;
	}

	.topic_content{
		text-align: left;
		font-size: 15px;
		margin-bottom: 5px;
	}

	.msgImageBox {
	    margin-top: 10px;
	    overflow: hidden;
	}

	.msgImageBox img {
	    max-width: 50%;
	    height: 100px;
	    float: left;
	    margin-right: 10px;
	    margin-bottom: 10px;
	}

	.divide {
	    width: 100%;
	    height: 10px;
	    background-color: #efeff4;
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