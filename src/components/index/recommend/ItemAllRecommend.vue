<template>
	<div id="itemAllRecommend" style="height:100%">
		<view-box ref="viewBox" body-padding-top="40px">
			<x-header slot="header" :left-options="{backText: ''}" style="background-color: #fff;z-index: 10086;width:100%;position:absolute;left:0;top:0;">
            	<p style="color:#000">{{title}}</p>
	        </x-header>

	        <div id="container">
	        	<div class="item" v-for="cartoon in list" @click="toDetail(cartoon.cartoon_Id._id)">
	        		<div class="itemLeft">
	        			<img :src="cartoon.cartoon_Id.cartoon_cover">
	        		</div>
	        		<div class="itemRight">
	        			<div class="cartoon-name">
	        				<strong>{{cartoon.cartoon_Id.cartoon_name}}</strong>
	        			</div>
	        			<div class="cartoon-author">
	        				{{cartoon.cartoon_Id.author}}
	        			</div>
	        			<div class="cartoon-pop">
	        				人气值: {{cartoon.cartoon_Id.cartoon_popVal}}
	        			</div>
	        			<div class="cartoon-tag">
	        				<div v-for="tag in cartoon.cartoon_Id.cartoon_tag" style="float:left;width: auto;margin-right: 5px;">{{tag.tag_name}}</div>
	        				
	        			</div>
	        		</div>
	        		<div class="logo">
	        			<img src="/static/watch.png">
	        			详情
	        		</div>
	        	</div>
	        </div> 
		</view-box>
	</div>
</template>

<script>
import { XHeader,ViewBox } from 'vux'
	export default{
		data(){
			return{
				title:'',
				list:''
			}
		},
		methods:{
			getRecommend(){
				//获取管理员推荐的所有漫画
				var _this = this;
				_this.axios.get('/cartoon/getAllRecommend', {
		          params: {}
		        })
		        .then(function (response) {
		        	console.log("response",response);
		        	let cartoons = response.data;
		        	for(let i = 0; i < cartoons.length; i++ ){
		        		cartoons[i].cartoon_Id.cartoon_cover = _this.baseUrl +  cartoons[i].cartoon_Id.cartoon_cover;
		        	}
		        	_this.list = cartoons;
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
		      });
			},
			getHot(){
				//获取所有的完结漫画
				var _this = this;
				_this.axios.get('/cartoon/getAllHot', {
		          params: {}
		        })
		        .then(function (response) {
		        	console.log("response",response);
		        	let cartoons = response.data;
		        	_this.list = [];
		        	for(let j = 0; j < cartoons.length; j++ ){
		        		_this.list.push({
		        			cartoon_Id:{
		        				"_id":cartoons[j]._id,
		        				"cartoon_cover":_this.baseUrl + cartoons[j].cartoon_cover,
		        				"cartoon_name": cartoons[j].cartoon_name,
		        				"author":cartoons[j].author,
		        				"cartoon_popVal":cartoons[j].cartoon_popVal,
		        				"cartoon_tag":cartoons[j].cartoon_tag
		        			}
		        		});
		        	}
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
		      });
			},
			getEnd(){
				//获取完结漫画
			},
			toDetail(cartoonId){
		         this.$router.push('/cartoonDetail/' + cartoonId)
			}
		},
		components:{
			XHeader,
			ViewBox
		},
		mounted(){
			let type = this.$route.params.type;
			if(type == "recommend"){
				this.title = "主编推荐"
				this.getRecommend();	
			}else if(type == "hot"){
				this.title = "热门佳作"
				this.getHot();
			}else if(type == "end"){
				this.getEnd();
			}else{

			}
			
		}
	}
</script>

<style scoped>
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
	#itemAllRecommend{
		margin: 0;
		padding: 0;
	}

	.container{
		width: 100%;
		height: auto;
	}

	.item{
		width: 100%;
		height: 150px;
		margin-bottom: 20px;
	}

	.itemLeft{
		max-width: 30%;
		height: 100%;
		float: left;
		overflow: hidden;
	}

	.itemLeft img{
		width: auto;
		height: 100%;
	}

	.itemRight{
		width: 60%;
		float: left;
		height: 100%;
		padding-left: 10%;
	}

	.itemRight div{
		width: 100%;
		height: 25%;
		text-align: left;
		line-height: 30px;
	}

	.cartoon-name{
		font-size: 20px;
	}

	.cartoon-author, .cartoon-pop, .cartoon-tag{
		font-size: 16px;
		color: #666;
	}

	.logo{
		max-width: 10%;
		height: 100%;
		float: left;
		vertical-align: middle;
		text-align: right;
		font-size: 14px;
		color: #FF9900;
	}

	.logo img{
		width: 30px;
		height: 30px;
		float: right;
		vertical-align: middle;
		margin-top: 60px;
	}
</style>