<template>
	<div id="message">
		<x-header :left-options="{backText: ''}" style="background-color: #fff">
			<p style="color:#000">消息</p>
		</x-header>
		<div class="divide"></div>
		<div class="mePublish">
			<div class="mePublishContainer">
				<div class="msg" v-if="messageList.length == 0">
					<div class="empty">
					</div>
					<div class="text">
						一条消息都没有
					</div>
				</div>
				<div v-for="message in messageList">
					<swipeout>
						 <swipeout-item transition-mode="follow">
				        <div slot="right-menu">
				          <swipeout-button @click.native="onButtonClick(message._id)" type="primary">删除消息</swipeout-button>
				          <swipeout-button @click.native="onButtonClick('delete')" type="warn">取消</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-t">
				        	<div class="topicItem" >
								<div class="topic_user">
									<div style="float:right" v-if="message.message_is_read == false"><badge></badge></div>
									<img :src="message.message_sender.user_img">
									<div class="topic-username">
										<span style="display: block;float:left;font-weight:normal">{{message.message_sender.user_name}}</span>
										<span style="display: block;float:left;font-size:13px;margin-left: 10px;">发表了一个新话题</span>
									</div>		
								</div>
								<div class="topic_content" @click="toDetail(message.topic_id._id,message._id)">
									{{message.topic_id.text_content}}
								</div>
								<div class="msgImageBox" v-show="message.topic_id.image_content.length > 0 ">
                                        <img  v-for="image in message.topic_id.image_content" :src="image">
                                    </div>
								<div class="topic_other_info">
									<div class="time">
										{{dateformat(message.topic_id.post_time)}}
									</div>
									<div class="comment-agree">
										 <div class="agree">
			                                <img src="static/agree.png">
			                                <div class="count">&nbsp;&nbsp;{{message.topic_id.comment.length}}</div>
			                            </div>

			                            <div class="comment">
			                                <img src="static/comment.png">
			                                    <div class="count">&nbsp;&nbsp;{{message.topic_id.comment.length}}</div>
			                            </div>
									</div>
								</div>
							</div>
				        </div>
				      </swipeout-item>
					</swipeout>
					<div class="divide"></div>
				</div>
			</div>
		</div>

		    <div v-transfer-dom>
		      <confirm v-model="showDeleteComfirm"
		      :title="'确定删除该消息吗?'"
		      @on-cancel="onCancel"
		      @on-confirm="onConfirm">
		        <p style="text-align:center;">确定删除该消息吗</p>
		      </confirm>
		    </div>
	</div>
</template>

<script>
import { XButton,XHeader,Divider,Badge,Swipeout, SwipeoutItem, SwipeoutButton,Confirm,TransferDomDirective as TransferDom} from 'vux';
	export default{
		inject:['reload'],
		directives: {
		    TransferDom
		},
		data(){
			return {
				messageList:'',
				showDeleteComfirm:false,
				deleteMsgId:''
			}
		},
		methods:{
			init(userId){
				var _this = this;
                _this.axios.get('/user/findMessageByUserId/' + userId, {
                  params: {}
                })
                .then(function (response) {
                	let topicArray = response.data.msg.text;
                	console.log(topicArray);
                	//用户头像修改
                	for(let i = 0; i < topicArray.length; i++){
						topicArray[i].message_sender.user_img = _this.baseUrl + topicArray[i].message_sender.user_img;

						//话题图片地址修改
                		for(let j = 0; j < topicArray[i].topic_id.image_content.length; j++){
                			topicArray[i].topic_id.image_content[j] =  _this.baseUrl + topicArray[i].topic_id.image_content[j];
                		}
                	}
                	_this.messageList = response.data.msg.text;
                })
                .catch(function (err) {
                  console.log("err: " + err);
              });
			},
			dateFormat(time){

			},
			toDetail(topic_id,messageId){
				//修改状态为已读
				let _this = this;
				var url = '/user/updateMessageStatus'
				var params = new URLSearchParams();
				params.append('messageId', messageId);
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
					console.log("res",res);

				    if(res.data.msg.status == "ok"){
				    	_this.$router.push('/community/detail/' + topic_id);
				    }
				});
			},
			onButtonClick(msgId){
				this.deleteMsgId = msgId;
				this.showDeleteComfirm = true;
			},
			onConfirm(){
				let _this = this;
				var url = '/user/deleteMsg'
				var params = new URLSearchParams();
				params.append('msgId', _this.deleteMsgId);
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
				    if(res.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
				          text: '删除成功'
					    })
						_this.reload();
				    }else{
				    	_this.$vux.toast.show({
				    		type:'cancel',
				        	text: '删除失败'
					    })
				    }
				});
			},
			onCancel(){
				this.showDeleteComfirm = false;
			}
		},
		mounted(){
			let userId = this.$route.params.userId;
			this.init(userId);
		},
		components: {
    		XHeader,
    		Divider,
    		Badge,
    		Swipeout,
    		SwipeoutItem,
    		SwipeoutButton,
    		Confirm,

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
		margin-bottom: 5px;
	}

	.topic_user img{
		width: 40px;
		height: 40px;
		float: left;
		margin-right: 10px;
	}

	.topic-username{
		float: left;
		line-height: 40px;
		font-weight: bold;
		font-size: 16px;
		margin-left:10px;
	}

	.topic_content{
		text-align: left;
		line-height: 40px;
		font-weight: normal;
		font-size: 14px;
	}

	.msgImageBox {
    margin-top: 10px;
    overflow: hidden;
    vertical-align:middle;
    display: table-cell;
}

.msgImageBox img {
    max-width: 30%;
    max-height: 130px;
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