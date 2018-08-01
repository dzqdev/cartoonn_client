<template>
    <div id="cartoonDetail">
        <x-header :left-options="{backText: '',preventGoBack:'true'}" @on-click-back="index" style="background-color: #fff;z-index: 10086;">
            <p style="color:#000">{{cartoon.cartoon_name}}</p>
        </x-header>

        <div class="cartoon-img">
            <img :src="cartoon.cartoon_showImg">
            <div class="cartoon-desc" >
                <span class="cartoonName">{{cartoon.cartoon_name}}</span>
                <span class="cartoonAuthor">{{cartoon.author}}</span>
                <span style="width: 100%;height:45px;display:block;float:left">
                	<span class="cartoonTag" style="height:30px;float:left" v-for="tag in cartoon.cartoon_tag">	#{{tag.tag_name}}#
                	</span>
                </span>
                
            </div>
        </div>



        <!-- 切换 -->
		 <div style="height:44px;">
	      <sticky
	        ref="sticky"
	        :offset="0"
	        :check-sticky-support="false"
	        :disabled="disabled">
	        <tab :line-width="1" bar-active-color="#f3890e" active-color="#f3890e" custom-bar-width="30px">
	          <tab-item selected @on-item-click="toggleTab">详情</tab-item>
	          <tab-item @on-item-click="toggleTab">目录</tab-item>
	        </tab>
	      </sticky>
	    </div>
	   
	   <div class="infomation" v-show="selectedIndex == 0">
	   	<toast v-model="showCollect" type="cancel" width="150px">收藏失败,还没有章节</toast>
	   		<div class="collectionRead">
	   			<span class="collection" style="display:block;">
	   				<div v-if="isCollect" @click="cancleCollect" style="line-height: 30px;">
	   					 <x-icon type="ios-heart" size="30"></x-icon>
	   					 收藏
	   				</div>
	   				<div v-if="!isCollect" @click="collect" style="line-height: 30px;">
	   					 <x-icon type="ios-heart-outline" size="30" ></x-icon>
	   					 收藏
	   				</div>
	   			</span>
	   			<span class="read" v-if="chapterSize > 0">
	   				<!-- 收藏 -->
	   				<div v-if="isCollect">
	   					<x-button type="warn" mini style="border-radius:99px;" @click.native="toChapter(collectInfo._id,cartoon._id)">续看第{{collectInfo.chapter_number}}话</x-button>
	   				</div>
	   				<div v-if="!isCollect">
	   					<x-button type="warn" mini style="border-radius:99px;" @click.native="toChapter(cartoon.cartoon_chapter[0]._id,cartoon._id)">观看第一话</x-button>
	   				</div>
	   			</span>
	   			<span class="read" v-if="chapterSize == 0">
	   				<x-button type="warn" mini style="border-radius:99px;">还没有章节</x-button>
	   			</span>
	   		</div>
	   		<div class="introduction">
	   			<div class="content" :style="{overflow:isSpread?'hidden':'visible',height:isSpread?70+'px':'auto'}">
	   				{{cartoon.cartoon_desc}}
	   			</div>
	   			<span class="spread"  @click="doSpread">{{spreadIcon}}</span>
	   		</div>
	   		<card>
		      <div slot="content" class="card-demo-flex card-demo-content01">
		        <div class="vux-1px-r">
		          <span>星期{{getWeekDay(cartoon.cartoon_updateTime)}}</span>
		          <br/>
		          更新时间
		        </div>
		        <div class="vux-1px-r">
		          <span>{{cartoon.cartoon_popVal==undefined?0:cartoon.cartoon_popVal}}</span>
		          <br/>
		          人气值
		        </div>
		        <div class="vux-1px-r">
		          <span>{{cartoon.cartoon_grade==undefined?0:cartoon.cartoon_grade}}</span>
		          <br/>
		          {{raterCount}}人已评
		        </div>
		      </div>
		    </card>

		    <!-- 分隔线 -->
		    <div class="divide"></div>
			
			<!-- 热门话题 -->
			<div class="rater">
				<div class="rater-header">
					<strong>漫画评分</strong>
				</div>
				<div class="rater-container" v-if="alreadyRater == ''">
					<rater v-model="rater" star="✩" active-color="#FF9900" :margin="4" v-if=""></rater>
					<span style="display:inline-block;float:right;font-size:18px;padding-right: 40px;color:red">{{rater*2}}.0</span>
					<div class="rater-footer">
					 <x-button mini type="warn" @click.native="userRater">评分</x-button>
					</div>
				</div>
				<div class="rater-container" v-if="alreadyRater != '' ">
					<span style="display:inline-block;float:left;font-size:16px;padding-left: 20px;">我的评分</span>
					<rater v-model="alreadyRater.score/2" star="✩" active-color="#FF9900" :margin="4" disabled></rater>
					<div class="rater-footer" style="font-size: 20px;color:red">
					 {{alreadyRater.score}}.0 
					</div>
				</div>
			</div>
	   </div>

		<!-- 目录 -->
	   <div class="catalogue" v-show="selectedIndex == 1">
	        <div class="catalogue-info">
	        	<span class="catalogue-left">
	        		全部章节（{{chapterSize}}）
	        	</span>
	        	<span class="catalogue-right">
	        		正序
	        	</span>
	        </div>

	        <div class="catalogueItem" v-if="chapterSize ==  0">
	   			还没有章节哦!
	   		</div>

	   		<div class="catalogueItem" v-if="chapterSize > 0" v-for="(chapter,index) in cartoon.cartoon_chapter" @click="toChapter(chapter._id,cartoon._id)">
	   			<!-- 上面 -->
	   			<div class="catalogue-top">
	   				{{index+1}} - {{chapter.chapter_title}}
	   			</div>

	   			<div class="catalogue-bottom">
	   				<span class="time">{{timeFormat(chapter.chapter_updateDate)}}</span>
	   				<span class="chapter-agree">
	   					<span style="display:block;width:20px;height:20px;float:left;margin-right: 8px;padding-top:2px"><img style="height:100%;width:100%;" src="/static/agree.png"></span>
	   					{{chapter.chapter_agree}}
	   				</span>
	   			</div>
	   		</div>
	   </div>
 
    </div>
</template>

<script>
import {
    XHeader,
    Sticky,
    Tab,
    TabItem,
    Card,
    Cell,
    Group,
    XButton,
    Toast,
    Rater
} from 'vux'

import {mapGetters} from 'vuex'
export default {
	inject:['reload'],
    data() {
        return {
			disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
			isSpread:true,
			spreadIcon:"∨",
			//当前选中的选项卡
			selectedIndex:0,
			//漫画信息
			cartoon:'',
			//总章节数量
			chapterSize:0,
			//是否收藏
			isCollect:false,
			//收藏信息
			collectInfo:'',
			showCollect:false,
			//未打分的星数
			rater:0,
			//打分的用户以及星
			alreadyRater:'',
			raterCount:''
        }
    },
    methods: {
    	doSpread(){
    		//展开详情
    		this.isSpread = !this.isSpread;
    		this.isSpread?this.spreadIcon="∨":this.spreadIcon="∧";
    	},
    	//切换选项卡
    	toggleTab(index){
    		this.selectedIndex = index;
    	},
    	//初始化页面
    	getCartoonInfo(cartoonId){
    		var _this = this;
    		let user_id = _this.getStorage.text['_id'];
			_this.axios.get('/cartoon/getCartoon/'+ cartoonId + '/' + user_id , {
	          params: {
	          }
	        })
	        .then(function (response) {
	        	console.log("detail",response);
	        	// this.cartoonList = response.data.Recommends;
	        	_this.cartoon = response.data.cartoon;

	        	_this.cartoon.cartoon_showImg = _this.baseUrl + response.data.cartoon.cartoon_showImg;
	        	//章节的数量
	        	_this.chapterSize = response.data.cartoon.cartoon_chapter.length;
	        	//当前用户是否收藏该漫画
	        	_this.isCollect = response.data.isCollect;
	        	//评分人数
	        	_this.raterCount =  response.data.cartoon.rater_users.length;
	        	if(response.data.rater){
	        		_this.alreadyRater = response.data.rater;
	        	}
	        	if(response.data.collect != ''){
	        		_this.collectInfo = response.data.collect[0].last_watch;
	        	}
	        })
	        .catch(function (err) {
	          console.log("err: " + err);
		    });
    	},
    	cancleCollect(){
			var _this = this;
			//收藏
			// 漫画id以及用户id
			let user_id = _this.getStorage.text['_id'];
			let cartoon_id = _this.$route.params.cartoonId;
			var url = '/bookShelf/unCollect'
			var params = new URLSearchParams();
			params.append('user_id', user_id);
			params.append('cartoon_id', cartoon_id); 
			_this.axios({
			    method: 'post',
			    url:url,
			    data:params
			}).then((res)=>{
				if(res.data.msg.status == "ok"){
					_this.isCollect = false;
				}
			});
    	},
    	collect(){
			var _this = this;
			if(_this.chapterSize == 0){
    			_this.showCollect = true;
    		}else{
    			//收藏
				// 漫画id以及用户id
				let user_id = _this.getStorage.text['_id'];
				let cartoon_id = _this.$route.params.cartoonId;
				var url = '/bookShelf/collect'
				var params = new URLSearchParams();
				params.append('user_id', user_id);
				params.append('cartoon_id', cartoon_id);
				params.append('last_watch', ''); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
					if(res.data.msg.status == "no_chapter"){
						_this.showCollect = true;
					}else if(res.data.msg.status == "ok"){
						_this.isCollect = true;
					}
				});
    		}
    	},
    	//时间格式化
    	timeFormat(time){
    		let date = new Date(time);
    		let year = date.getFullYear();
    		let month = date.getMonth() + 1;
    		month = month>=10?month:'0' + month;
    		let day = date.getDate();
    		day = day>=10?day:'0' + day;
    		return year + '-' + month + '-' + day;
    	},
    	userRater(){
    		let _this = this;
    		//获取漫画id
			let cartoon_id = _this.$route.params.cartoonId    		
    		//获取分数
    		let score = parseInt(_this.rater)*2;
    		//获取用户id
    		let user_id = _this.getStorage.text._id;

    		console.log(score);
    		var url = '/cartoon/rater'
			var params = new URLSearchParams();
			params.append('cartoon_id', cartoon_id);
			params.append('score', score);
			params.append('user_id', user_id); 
			_this.axios({
			    method: 'post',
			    url:url,
			    data:params
			}).then((res)=>{
				console.log("res",res);

			    if(res.data.msg.status == "ok"){
			    	_this.$vux.toast.show({
          				text: '评分成功',
          				onHide () {
          					_this.reload();
				        }
          			});
			    }else{
			    	_this.$vux.toast.show({
          				text: '评分失败'
          			});
			    }
			});
    	},
    	toChapter(chapterId,cartoonId){
    		this.$router.push('/cartoonDetail/chapter/' +  cartoonId + '/' + chapterId);
    	},
    	index(){
    		//返回首页
    		this.$router.push('/');
    	},
    	//获取星期几
    	getWeekDay(day){
    		let days = ['日','一','二','三','四','五','六'];
    		return days[day];
    	}
    },
    components: {
        XHeader,
        Sticky,
        Tab,
        TabItem,
        Card,
        Cell,
        Group,
        XButton,
        Toast,
        Rater 
    },
    mounted(){
    	this.getCartoonInfo(this.$route.params.cartoonId);
    },
    computed:{
    	...mapGetters([
    		'getStorage'
    	])
    }
}
</script>

<style scoped>
.cartoon-img {
    position: relative;
    width: 100%;
    height: 200px;
    top: 0;
    overflow: hidden;
}

.cartoon-img img {
    height: auto;
    width: 100%;
    float: left;
}

.cartoon-desc {
    position: absolute;
    height: 105px;
    color: #fff;
    text-align: left;
    left: 10px;
    bottom: 0;
}

.cartoon-desc .cartoonName,.cartoon-desc .cartoonAuthor {
    display: block;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 15px;
}

.cartoonTag {
    float: left;
    font-size: 15px;
    margin-right: 5px;
}

.divide{
	width: 100%;
	height: 10px;
	background-color: #efeff4;
	float: left;
}

/*漫画信息*/
.introduction{
	width: 96%;
	margin-left: 2%;
	padding-top: 10px;
	position: relative;
}

.collectionRead{
	width: 100%;
	height: 40px;
}

.collectionRead span{
	float: left;
	width: 50%;
	display: inline-block;
	line-height: 40px;
	height: 40px;
}

.content{
	height: 70px;
	text-align: left;
	-webkit-box-orient: vertical;
	display: -webkit-box;
	font-size: 15px;
}

.spread{
	display: inline-block;
	width: 35px;
	height: 20px;
	font-size: 20px;
	position: absolute;
	bottom: 0;
	right: 0;
	line-height: 20px;
	background-color: #fff;
	color: #000;
}

.rater-header{
	width: 100%;
	height: 40px;
	font-size: 16px;
	line-height: 40px;
	text-align: center;
	margin-bottom: 20px;
}

.rater-container{
	width: 100%;
	height: 80px;
}

.rater-footer{
	width: 100%;
	min-height: 20px;
	margin-top: 10px;
}


.card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  padding: 10px 0;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 16px;
}
.card-demo-flex span {
  color: #f74c31;
}


/*目录*/
.catalogue{
	width: 100%;
	height: auto;
}

.catalogue-info{
	width: 90%;
	margin-left: 5%;
	height: 50px;
	background-color: #fff;
	font-size: 15px;
}

.catalogue-info span{
	display: block;
	float: left;
	width: 50%;
	line-height: 50px;
}

.catalogue-left{
	text-align: left;
}

.catalogue-right{
	text-align: right;
}

.catalogueItem{
	width: 90%;
	margin-left: 5%;
	height: 80px;
	border-bottom: 1px solid #ccc;
	text-align: left;
}

.catalogue-top,.catalogue-bottom{
	width: 100%;
	height: 40px;
	float: left;
	line-height: 40px;
	color: #000;
	font-size: 18px;
}

.time,.chapter-agree{
	width: 35%;
	height: 100%;
	display: block;
	float: left;
	line-height: 40px;
	color: #777;
	font-size: 16px;
}

.collection{
	display: block;
	float: left;
	padding-top: 5px;
}

.collection .vux-x-icon {
  fill: red;
}


</style>
