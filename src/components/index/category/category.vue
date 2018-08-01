<template>
	<div id="category">
		 <x-header :left-options="{backText: ''}" style="background-color: #fff"><p style="color:#000">分类</p></x-header>
		<div class="condition">
			<div class="type">
				<span class="item" v-bind:class="{ active: index==selectedType}" v-for="(type,index) in types" @click="typeClick(index,type._id)" v-model="selectedType">
					{{type.category_name}}
				</span>
			</div>
			<div class="is-end">
				<span class="item" v-bind:class="{ active: isEndIndex== selectedIsEnd}" v-for="(isEnd,isEndIndex) in isEnds" @click="isEndClick(isEndIndex,isEnd.val)">
					{{isEnd.title}}
				</span>
			</div>
		</div>

		<div class="view">
			<!-- <div v-if="cartoonList.length <= 0">
				还没有漫画哦!!
			</div> -->
			<div class="msg" v-if="cartoonList.length == 0">
			<div class="empty">
			</div>
			<div class="text">
				还没有漫画哦!!
			</div>
		</div>
			<div class="cartoonItem" :style="{width: itemWidth + 'px',marginRight:(index+1)%3==0?0+'px':15 + 'px',float:'left',marginBottom:10 + 'px'}" v-for="(cartoon,index) in cartoonList" v-if="cartoonList.length > 0" @click="cartoonInfo(cartoon._id)">
				<p>
					<img :src="cartoon.cartoon_cover" style="width: 100%;height:180px">
				</p>
				<p style="height:30px;line-height:30px;font-size:15px">{{cartoon.cartoon_name}}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { XHeader} from 'vux'
import {mapGetters} from 'vuex'
	export default{
		data(){
			return{
				types:'',
				isEnds:[{
					'title':'全部',
					'val':'all'
					},{
					'title':'连载',
					'val':'false'
					},{
					'title':'完结',
					'val':'true'
					}],
				selectedType:0,
				selectedTypeId:'all',
				selectedIsEnd:0,
				selectedIsEndVal:'all',
				cartoonList:''
			}
		},
		methods:{
			cartoonInfo(cartoonId){
				this.$router.push({
		          path: `/cartoonDetail/${cartoonId}`,
		        })
			},
			typeClick(index,type){
				console.log(index,type);
				this.selectedType = index;
				this.selectedTypeId = type;
				var _this = this;
				_this.axios.get('/cartoon/allCartoon/' + type + '/' + this.selectedIsEndVal, {
		          params: {
		          }
		        })
		        .then(function (response) {
		        	for(let i = 0; i < response.data.cartoons.length; i++){
		        		response.data.cartoons[i].cartoon_cover = _this.baseUrl + response.data.cartoons[i].cartoon_cover ;
		        	}

		        	_this.cartoonList = response.data.cartoons;
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
		      	});
			},
			isEndClick(isEndIndex,isEnd){
				this.selectedIsEnd = isEndIndex;
				this.selectedIsEndVal = isEnd;
				var _this = this;
				_this.axios.get('/cartoon/allCartoon/' + this.selectedTypeId + '/' + isEnd, {
		          params: {
		          }
		        })
		        .then(function (response) {
		        	for(let i = 0; i < response.data.cartoons.length; i++){
		        		response.data.cartoons[i].cartoon_cover = _this.baseUrl + response.data.cartoons[i].cartoon_cover ;
		        	}

		        	_this.cartoonList = response.data.cartoons;
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
		      	});
			},
			getCategories(){
				var _this = this;
				_this.axios.get('/category/allCategory', {
		          params: {}
		        })
		        .then(function (response) {
		        	_this.types = response.data.categories;
		        	_this.types.unshift({"category_name":"全部",'_id':'all'});
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
		      	});
			},
			getAllCartoon(){
				var _this = this;
				_this.axios.get('/cartoon/allCartoon', {
		          params: {}
		        })
		        .then(function (response) {
		        	for(let i = 0; i < response.data.cartoons.length; i++){
		        		response.data.cartoons[i].cartoon_cover = _this.baseUrl + response.data.cartoons[i].cartoon_cover ;
		        	}

		        	_this.cartoonList = response.data.cartoons;
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
		      	});
			}
		},
		components:{
			XHeader
		},
		computed:{
			...mapGetters([
				'getWidowWidth'
			]),
			itemWidth:function(){
				var itemWidth = (this.getWidowWidth-30)/3;
				return itemWidth;
			}
		},
		mounted(){
			this.getCategories();
			this.getAllCartoon();
		}
	}
</script>


<style scoped>
	.condition{
		width: 90%;
		padding-left: 5%;
		background-color: #fff;
	}

	.type{
		width: 100%;
		min-height: 38px;
		float: left;
	}

	.is-end{
		width: 100%;
		min-height: 38px;
		margin-bottom: 10px;
	}

	.item{
		min-height: 35px;
		min-width: 13%;
		font-size: 15px;
		color: #777;
		text-align: center;
		line-height: 35px;
		float: left;
	}

	.active{
		border-radius: 15px;
		box-sizing: border-box;
		border:1px solid #f3890e;
		color: #f3890e;
		height: 33px;
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

	.view{
		width: 100%;
		height: auto;
		float: left;
		margin-top:10px;
	}
</style>