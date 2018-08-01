<template>
	<div id="recommend">
		<scroller
          use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh"
          lock-x ref="scrollerBottom" height="600">
          <div>
          		<SwiperVue></SwiperVue>
				<div id="functions">
					<flexbox>
				      <flexbox-item>
				      	<x-button :gradients="['#1D62F0', '#19D5FD']" style="border-radius:99px;" link="/category">
				      		分类
				  		</x-button>
				  	  </flexbox-item>
				      <flexbox-item><x-button :gradients="['#A644FF', '#FC5BC4']" style="border-radius:99px;">排行榜</x-button></flexbox-item>
			    	</flexbox>
				</div>
				
				<!-- 系统推荐 -->
				<div id="system-recommend">
					<divider>小编推荐</divider>
					<div style="width: 100%;height:100%;float:left">
						<ItemVue v-for="(cartoon,index) in recommendList" :showType="'bill'" :cartoon-object="cartoon" :count="2" :IsRight="(index+1)%2==0?true:false" :itemHeight="200" :key="index"></ItemVue>
					</div>
					<div style="float:left;width: 100%;height:auto">
						<x-button plain mini type="default" style="border-radius:99px;float:right" @click.native="toMore('recommend')">更多>></x-button>
					</div>
					<div class="divide"></div>
				</div>
				
				<!-- 热门佳作 -->
				<div id="most-read">
					<divider>热门佳作</divider>
					<div style="width: 100%;height:100%;float:left">
						<ItemVue v-for="(cartoon,index) in hotCartoonList" :showType="'cover'" :cartoon-object="cartoon" :count="3" :IsRight="(index+1)%3==0?true:false" :itemHeight="200" :key="index"></ItemVue>	
					</div>
					<div style="float:left;width: 100%;height:auto">
						<x-button plain mini  type="default" style="border-radius:99px;float:right" @click.native="toMore('hot')">更多>></x-button>
					</div>
					<div class="divide"></div>
				</div>

				<!-- 完结作品 -->
				<div id="end-cartoon">
					<divider>完结作品</divider>
					<div style="width: 100%;height:100%;float:left">
						<ItemVue v-for="(cartoon,index) in endCartoons" :showType="'cover'" :cartoon-object="cartoon" :count="3" :IsRight="(index+1)%3==0?true:false" :itemHeight="200" :key="index"></ItemVue>	
					</div>
					<div style="float:left;width: 100%;height:auto">
						<x-button plain mini  type="default" style="border-radius:99px;float:right" >更多>></x-button>
					</div>
					<div class="divide"></div>
				</div>
          </div>
		</scroller>
	</div>
</template>

<script>
import SwiperVue from './swiper.vue'
import ItemVue from './item.vue'
import { Divider,XButton,Flexbox,Scroller, FlexboxItem,WechatEmotion as Emotion } from 'vux';
const pulldownDefaultConfig = {
 content: '上拉刷新',
 height: 40,
 autoRefresh: false,
 downContent: '上拉刷新',
 upContent: '释放后刷新',
 loadingContent: '正在刷新...',
 clsPrefix: 'xs-plugin-pulldown-'
}
	export default{
		inject:['reload'],
		data(){
			return{
				recommendList:[],
				hotCartoonList:[],
				endCartoons:[],
				pulldownDefaultConfig: pulldownDefaultConfig,
			}
		},
		methods:{
			//初始化
			init(){
				var _this = this;
				_this.axios.get('/cartoon/index', {
		          params: {}
		        })
		        .then(function (response) {
		        	console.log("response",response);
					//小编推荐
					let responseRecommendList = response.data.recommend;
					for(let i = 0; i < responseRecommendList.length; i++){
						_this.recommendList.push(
							{"cartoonId":responseRecommendList[i].cartoon_Id['_id'],
							"cartoonName":responseRecommendList[i].cartoon_Id['cartoon_name'],
							"cartoonImg":_this.baseUrl + responseRecommendList[i].cartoon_Id['cartoon_cover'],
							"cartoonBill":_this.baseUrl + responseRecommendList[i].cartoon_Id['cartoon_showImg'],
							"cartoonDesc":responseRecommendList[i].cartoon_Id['cartoon_desc']
							}
						);
		        	}
		        	//热门佳作
		        	let responseHotList = response.data.hot_cartoon_Find;
					for(let j = 0; j < responseHotList.length; j++){
						_this.hotCartoonList.push(
							{"cartoonId":responseHotList[j]['_id'],
							"cartoonName":responseHotList[j]['cartoon_name'],
							"cartoonImg":_this.baseUrl + responseHotList[j]['cartoon_cover'],
							"cartoonDesc":responseHotList[j]['cartoon_desc']
							}
						);
		        	}

		        	//完结漫画
		        	let responseEndList = response.data.end_cartoon_Find;
					for(let k = 0; k < responseEndList.length; k++){
						_this.endCartoons.push(
							{"cartoonId":responseEndList[k]['_id'],
							"cartoonName":responseEndList[k]['cartoon_name'],
							"cartoonImg":_this.baseUrl + responseEndList[k]['cartoon_cover'],
							"cartoonDesc":responseEndList[k]['cartoon_desc']
							}
						);
		        	}
		        	
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
		      });
			},
			refresh() { 
            	this.reload();
        	},
        	toMore(key){
        		this.$router.push('/more/' + key);
        	}
		},
		mounted(){
			this.init();
			this.$nextTick(() => {
	         this.$refs.scrollerBottom.reset({top: 0})
	        })
		},
		components:{
			SwiperVue,
			ItemVue,
			Divider,
			XButton,
			Flexbox,
			FlexboxItem,
			Emotion,
			Scroller
		}
	}
</script>

<style scoped>

#functions{
	width: 80%;
	margin-left: 10%;
	padding-top: 10px;
}


#system-recommend,#most-read,#free-cartoon,#end-cartoon,#xuanhuan-cartoon{
	width: 100%;
	background-color: #fff;
	margin-bottom: 10px;
	min-height: 500px;
	position: relative;
}

.divide{
	width: 100%;
	height: 10px;
	background-color: #efeff4;
	float: left;
	position: relative;
}
</style>