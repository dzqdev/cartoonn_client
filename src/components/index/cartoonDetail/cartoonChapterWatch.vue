<template>
	<div id="cartoonChapterWatch">
		<!-- 头部 -->
		<div v-transfer-dom>
	      <popup v-model="show" position="top">
	         <x-header :left-options="{backText: '',preventGoBack:'true'}" @on-click-back="back"  style="background-color: #000;z-index: 10086;">
            	<p style="color:#fff">{{cartoonInfo.cartoon_name}}</p>
        	</x-header>
	      </popup>
	    </div>
	    <!-- 底部工具 -->
	    <div v-transfer-dom>
	      <popup v-model="show" position="bottom">
	      	<div class="util">
	      		<div class="utilItem">
	      			<span class="item-top">
	      				<img src="/static/catalogue.png">
	      			</span>
	      			<span class="item-bottom" @click="toggleRight">目录</span>
	      		</div>
	      	</div>
	      </popup>
	    </div>
	    <!-- 目录 -->
	    <div v-transfer-dom>
	      <popup v-model="showRight" position="right" should-scroll-top-on-show>
	        <div style="width:300px">
	        	<div class="catalogue-head">{{cartoonInfo.cartoon_name}}</div>
	        	<div class="catalogue-info">共 {{chapterCount}} 话</div>
	        	<div class="catalogue-body">
	        		<div class="catalogue-item" v-for="(chapter,index) in chapterCatalogue" @click="toOtherChapter(chapter._id)">
	        			{{index+1}} - {{chapter.chapter_title}}
	        		</div>
	        	</div>
	        </div>
	      </popup>
	    </div>
	     <div v-transfer-dom>
		      <confirm v-model="showComfirm"
		      :title="'是否收藏该漫画'"
		      @on-confirm="onConfirm"
		      @on-cancel="onCancel">
		        <p style="text-align:center;">是否收藏?</p>
		      </confirm>
		</div>
	    <!-- 图片列表 -->
		<div v-for="image in chapterContent" style="background-color:#ccc;text-align:center;" @click="show = !show">
			<span style="display: block;"><img src="/static/loading.jpg" style="width:100%;height:auto"></span>
	      <x-img :src="image.image_url"  @on-success="success" @on-error="error" class="ximg-demo" error-class="ximg-error" container="#vux_view_box_body"></x-img>
	    </div>

	    <!-- 评论显示页面 -->
	    <div class="chapter-commentShow">
	    	<div class="chapter-agree" >
	    		<div class="agree-img" v-if="!isAgreeChapter" @click="agreeChapter"><img src="/static/agree.png"></div>
	    		<div class="agree-img" v-if="isAgreeChapter" @click="cancelAgreeChapter"><img src="/static/agree_active.png"></div>
	    		{{chapterAgreeCount}}
	    	</div>
	    	<div class="chapter-some-comment">
	    		<div class="chapter-some-comment-header">本章精彩评论</div>
	    		<div class="chapter-some-comment-body">
	    			<div v-if="commentList.length == 0 || commentList == ''" style="text-align:center">
	    				还没有评论!!
	    			</div>
	    			<div class="chapter-some-comment-item" v-if="commentList.length > 0 && commentList != ''" v-for="comment in commentList">
	    				<div class="chapter-some-comment-item-top">
	    					<div class="user-info">
	    						<div class="user-img">
	    							<img :src="comment.post_userid.user_img">
	    						</div>
	    						<div class="user-name">{{comment.post_userid.user_name}}</div>
	    					</div>
	    					<div class="comment-info">
	    						<div class="time">
	    							{{dateformat(comment.post_time)}}
	    						</div>
	    						<div class="agree">
	    							<div class="agree-icon" v-if="comment.isAgree == false" @click="agreeComment(comment._id)">
	    								<img src="/static/agree.png">
	    							</div>
	    							<div class="agree-icon" v-if="comment.isAgree == true">
	    								<img src="/static/agree_active.png">
	    							</div>
	    							<div class="agree-count">{{comment.agree}}</div>
	    						</div>
	    					</div>
	    				</div>
	    				<div class="chapter-some-comment-item-bottom">{{comment.comment_content}}</div>
	    			</div>
	    		</div>
				<div class="post_comment" style="margin-top:10px;">
					<x-button mini type="warn" @click.native = "toPostComment">发表评论</x-button>
				</div>
	    	</div>
	    </div>
	</div>
</template>

<script>
import { XImg,XHeader,TransferDom,Popup, Group,Confirm,XButton} from 'vux';
import {mapGetters} from 'vuex'
	export default{
		inject:['reload'],
		data(){
			return{
				//图片列表
				chapterContent:'',
				//章节信息(存放目录)
				chapterCatalogue:'',
				//漫画信息
				cartoonInfo:'',
				//显示头尾
				show:false,
				//显示目录
				showRight:false,
				//章节数量
				chapterCount:0,
				//是否收藏
				isCollect:false,
				//是否收藏的提示框
				showComfirm:false,
				//评论列表
				commentList:'',
				isAgreeChapter:false,
				chapterAgreeCount:0,
				//记录该章节评论的信息,评论id和是否被当前用户评论过的信息
				chapterCommentAgreeInfo:''
			}
		},
		methods:{
			init(chapterId,cartoonId,userId){
				var _this = this;
				//查询章节的图片以及评论
				_this.axios.get('/cartoon/chapter/'+ chapterId + '/' + userId, {
		          params: {
		          }
		        })
		        .then(function (response) {
		        	//修改内容图片的路径并赋值给变量
		        	for(let i = 0 ; i < response.data.msg.chapter.chapter_content.length; i++){
		        		response.data.msg.chapter.chapter_content[i].image_url = _this.baseUrl + response.data.msg.chapter.chapter_content[i].image_url;
		        	}
		        	_this.chapterContent = response.data.msg.chapter.chapter_content;
		        	/*-----------------------------end--------------------------------*/ 
		        	if(response.data.msg.comment.length > 0){
		        		//修改评论头像的路径
		        		for(let j = 0; j < response.data.msg.comment.length; j++){
		        			response.data.msg.comment[j].post_userid.user_img = _this.baseUrl + response.data.msg.comment[j].post_userid.user_img;
		        		}
		        		//获取评论列表时同时把当前评论是否被当前用户点赞的信息记录下来
		        		let userAgreeCommentIds = response.data.msg.commentsResult;
		        		for(let k = 0; k < response.data.msg.comment.length; k++ ){
		        			//获取每一条评论id
		        			let comment = response.data.msg.comment[k];
		        			if(userAgreeCommentIds.indexOf(comment._id) > -1){
		        				//说明用户点赞过这条评论
		        				response.data.msg.comment[k].isAgree = true;
		        			}else{
		        				response.data.msg.comment[k].isAgree = false;
		        			}
		        		}
		        	}
		        	_this.commentList = response.data.msg.comment;
	        		_this.isAgreeChapter = response.data.msg.is_agree_chapter;
	        		_this.chapterAgreeCount = response.data.msg.chapter.chapter_agree;
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
			    });

			    //查询该漫画的所有章节和是否收藏等信息
			    _this.axios.get('/cartoon/getCartoon/'+ cartoonId + '/' + userId , {
		          params: {

		          }
		        })
		        .then(function (response) {
		        	_this.chapterCatalogue = response.data.cartoon.cartoon_chapter;
		        	_this.cartoonInfo = response.data.cartoon;
		        	_this.chapterCount = response.data.cartoon.cartoon_chapter.length;
		        	_this.isCollect = response.data.isCollect;
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
			    });
			},
			success (src, ele) {
		      const span = ele.parentNode.querySelector('span')
		      ele.parentNode.removeChild(span);
		    },
		    error (src, ele, msg) {
		      const img = ele.parentNode.querySelector('img')
		      span.src = '/static/load-fail.png'
		    },
		    toggleRight(){
		    	this.show = false;
		    	this.showRight = !this.showRight;
		    },
		    //点击后退按钮时的操作
		    back(){
		    	var _this = this;
		    	//漫画id
		    	let cartoonId = _this.$route.params.cartoonId;
		    	//用户id
				let userId = _this.getStorage.text._id;
		    	//如果没有收藏过,询问是否需要收藏漫画
		    	if(!_this.isCollect){
		    		_this.showComfirm = true;
		    	}else{
		    		//收藏过，直接返回
		    		//记录下当前的章节下次继续观看
					let chapterId = _this.$route.params.chapterId;
					var url = '/bookShelf/updateLastWatch'
					var params = new URLSearchParams();
					params.append('user_id', userId);
					params.append('cartoon_id', cartoonId);
					params.append('last_watch', chapterId); 
					_this.axios({
					    method: 'post',
					    url:url,
					    data:params
					}).then((res)=>{
						if(res.data.msg.status == "ok"){
							_this.$router.replace('/cartoonDetail/' +  cartoonId);
						}else{
							_this.$vux.toast.show({
					          text: '保存修改记录失败',
					          onHide () {
					            _this.$router.replace('/cartoonDetail/' +  cartoonId);
					          }
					        })
						}
					});
		    		
		    	}
		    },
		    //确定收藏
		    onConfirm(){
		    	var _this = this;
				//收藏
				// 漫画id以及用户id
				let user_id = _this.getStorage.text['_id'];
				let cartoon_id = _this.$route.params.cartoonId;
				let chapterId = _this.$route.params.chapterId;
				var url = '/bookShelf/collect'
				var params = new URLSearchParams();
				params.append('user_id', user_id);
				params.append('cartoon_id', cartoon_id);
				params.append('last_watch', chapterId); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
					if(res.data.msg.status == "ok"){
						this.$router.replace('/cartoonDetail/' +  cartoon_id);
					}
				});
		    },
		    //取消收藏
		    onCancel(){
		    	let cartoonId = this.$route.params.cartoonId;
		    	this.$router.replace('/cartoonDetail/' +  cartoonId);
		    },
		    //跳转到发表页面
		    toPostComment(){
		    	let chapterId = this.$route.params.chapterId;
		    	this.$router.push('/cartoonDetail/publishComment/' +  chapterId);
		    },
		    agreeChapter(){
		    	var _this = this;
		    	//章节id
		    	let chapterId = _this.$route.params.chapterId;
		    	//用户id
		    	let userId = _this.getStorage.text._id;
		    	var url = '/cartoon/chapter/agree'
				var params = new URLSearchParams();
				params.append('userId', userId);
				params.append('chapterId', chapterId); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
				    if(res.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
						 text: '点赞成功'
						})
						setTimeout(function(){
							_this.reload();
						}, 1000);
				    }else{
						_this.$vux.toast.show({
						 text: '点赞失败'
						})
				    }
				});
		    },
		    //取消对本章节的点赞
		    cancelAgreeChapter(){
		    	var _this = this;
		    	//章节id
		    	let chapterId = _this.$route.params.chapterId;
		    	//用户id
		    	let userId = _this.getStorage.text._id;
		    	var url = '/cartoon/chapter/cancelAgree'
				var params = new URLSearchParams();
				params.append('userId', userId);
				params.append('chapterId', chapterId); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
				    if(res.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
						 text: '取消成功'
						})
						setTimeout(function(){
							_this.reload();
						}, 1000);
				    }else{
						_this.$vux.toast.show({
						 text: '取消失败'
						})
				    }
				});
		    },
		    //对评论点赞
		    agreeComment(commentId){
		    	var _this = this;
		    	//用户id
		    	let userId = _this.getStorage.text._id;
		    	var url = '/cartoon/chapter/agreeComment'
				var params = new URLSearchParams();
				params.append('userId', userId);
				params.append('commentId', commentId); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
				    if(res.data.msg.status == "ok"){
				    	_this.$vux.toast.show({
						 text: '点赞成功'
						})
						setTimeout(function(){
							_this.reload();
						}, 1000);
				    }else{
						_this.$vux.toast.show({
						 text: '点赞失败'
						})
				    }
				});
		    },
		    toOtherChapter(chapterId){
		    	//漫画id
		    	let cartoonId = this.$route.params.cartoonId;
		    	//跳转到另外一章阅读
		    	this.$router.push('/cartoonDetail/chapter/' +  cartoonId + '/' + chapterId);
		    }
		},
		components: {
			XImg,
			XHeader,
			Popup,
			Group,
			Confirm,
			XButton
		},
		directives: {
			TransferDom
		},
		mounted(){
			let chapterId = this.$route.params.chapterId
			let cartoonId = this.$route.params.cartoonId;
			let userId = this.getStorage.text._id;
			this.init(chapterId,cartoonId,userId);
		},
		computed:{
			...mapGetters([
				'getStorage'
			])
		},
		watch: {
		   '$route' (to, from) {
		   	 let toPath = to.path;
		   	 let fromPath = from.path;

		   	 if(toPath != fromPath){
				if(toPath.indexOf("/cartoonDetail/chapter") > -1 && fromPath.indexOf("/cartoonDetail/chapter") > -1){
		   	 		this.reload();
		   	 	}
		   	 }
		   	 
		   }
		}
	}
</script>

<style scoped>
.ximg-demo {
  width: 100%;
  height: auto;
}
.ximg-error {
  background-color: yellow;
}
.ximg-error:after {
  content: '加载失败';
  color: red;
}

.util{
	width: 100%;
	height: 60px;
	background-color: #000;
	padding-left: 5%;
}

.utilItem{
	width: 20%;
	height: 60px;
}

.item-top{
	width: 100%;
	height: 30px;
	display: block;
	float: left;
}

.item-top img{
	width: 30px;
	height: 30px;
	margin: 0 auto;
}

.item-bottom{
	width: 100%;
	height: 20px;
	display: block;
	float: left;
	color: #fff;
}

.catalogue-head{
	height: 40px;
	color: #fff;
	line-height: 40px;
	font-size: 16px;
	text-align: center;
}

.catalogue-info{
	height: 30px;
	width: 100%;
	text-align: left;
	background-color: #000;
	line-height: 30px;
	color: #efefef;
	padding-left: 5%;
	font-size: 14px;
}

.catalogue-body{
	width: 100%;
	padding-left: 5%;
	padding-right: 5%;
	height: auto;
}

.catalogue-item{
	width: 100%;
	font-size: 15px;
	height: 50px;
	line-height: 50px;
	color: #fff;
	border-bottom: 1px solid #fff;
}

/*章节的评论*/
.chapter-commentShow{
	width: 100%;
}

.chapter-agree{
	width: 100%;
	height: 80px;
	background-color: #fff;
	padding-top: 10px;
}

.chapter-agree .agree-img{
	width: 100%;
	float: left;
}

.chapter-agree .agree-img img{
	width: 30px;
	height: 30px;
}

/*评论头部*/
.chapter-some-comment{
	width: 100%;
}

.chapter-some-comment-header{
	width: 100%;
	height: 30px;
	color: #666;
	height: 30px;
	font-size: 16px;
	padding-left: 5%;
	text-align: left;
	line-height: 30px;
	margin-bottom: 10px;
}

.chapter-some-comment-body{
	width: 100%;
	padding-left: 5%;
	padding-right: 5%;
}

/*每一条评论*/
.chapter-some-comment-item{
	width: 100%;
	min-height: 100px;
	border-radius: 20px;
	background-color: #efefef;
	margin-bottom: 10px;
}

/*用户名等信息*/
.chapter-some-comment-item-top{
	width: 100%;
	height: 50px;
	float: left;
}

.user-info{
	width: 50%;
	height: 100%;
	float: left;
}

.user-img{
	width: 30px;
	height: 30px;
	margin-top: 10px;
	float: left;
}

.user-img img{
	width: 100%;
	height: 100%;
	border-radius: 30px;
}

.user-name{
	margin-top: 10px;
	float: left;
	line-height: 30px;
	margin-left: 10px;
	height: 30px;
}

/*点赞信息*/
.comment-info{
	width: 50%;
	height: 100%;
	float: left;
}

.time{
	width: 50%;
	float: left;
	height: 50px;
	line-height: 50px;
}

.agree{
	width: 50%;
	height: 100%;
	float: left;
}

.agree .agree-icon{
	width: 20px;
	height: 20px;
	float: left;
}

.agree-icon img{
	width: 100%;
	height: 100%;
	margin-top: 12px;
}

.agree-count{
	margin-left: 10px;
	line-height: 45px;
	float: left;
	font-size: 16px;
}

/*评论内容*/
.chapter-some-comment-item-bottom{
	width: 100%;
	float: left;
	padding-left: 40px;
	text-align: left;
	color: #000;
}



</style>