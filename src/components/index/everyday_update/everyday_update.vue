<template>
	<div id="everyday_update">
		<tab :line-width="1">
			<tab-item :selected="dayIndex == 0" @on-item-click="onItemClick(dayIndex,day)" v-for="(day,dayIndex) in week" :key="day.value">{{day.text}}</tab-item>
		</tab>
     	<div v-for="(day,dayIndex) in week" :key="dayIndex" v-show="selectedIndex == dayIndex"> 
     		<div class="item-container" v-for="cartoons in data" @click="toDetail(cartoons._id)">
				<flexbox orient="vertical" :gutter="0" class="item-img">
			      <flexbox-item>
			      	 <x-img :src="cartoons.cartoon_showImg" container="#vux_view_box_body"></x-img>
			      </flexbox-item>
			    </flexbox>	
				<flexbox class="item-desc">
			      <flexbox-item :span="8">《{{cartoons.cartoon_name}}》<badge :text="cartoons.cartoon_category.category_name"></badge></flexbox-item>
			      <flexbox-item>查看全集</flexbox-item>
				</flexbox>
				<div class="divide"></div>
			</div>
      	</div>
	    	
	</div>
</template>

<script>
import { Tab, TabItem, Sticky, Divider, XButton,Swiper, SwiperItem,XImg,Badge,Flexbox, FlexboxItem} from 'vux'
	export default{
		inject:['reload'],
		data(){
			return{
				week:'',
				selectedIndex:0,
				data:'',
			}
		},
		methods:{
			onItemClick (index,value) {
				this.selectedIndex = index;
				this.initUI(value.value);			
    		},
    		initTab(){
    			var that = this;
				var weekArray = [1,2,3,4,5,6,0];
				var textArray = ['日',"一","二","三","四","五","六"];
				var result = [];

				var toady = new Date().getDay();
				var yestory = (toady-1+weekArray.length)%weekArray.length;

				for(var i = 0; i < weekArray.length; i++){
					if(weekArray[i] == toady){
						weekArray.splice(i,1);
					}
				}

				for(var j = 0; j < weekArray.length; j++){
					if(weekArray[j] == yestory){
						weekArray.splice(j,1);
					}
				}
				weekArray.push(yestory);
				weekArray.push(toady);
				//
				for(var i = 0; i < weekArray.length; i++){
					if(i == 5){
						result.push({"text":"昨天","value":weekArray[i]});
					}else if(i == 6){
						result.push({"text":"今天","value":weekArray[i]});
					}else{
						result.push({"text":"周" + textArray[weekArray[i]],"value":weekArray[i]});
					}
				}

				that.week = result;
    		},
    		initUI(time){
    			let that = this;
    			that.axios.get('/cartoon/findByUpdateTime/' + time,{}).then((response)=>{
					that.data = response.data.cartoons;
					for(let i = 0; i < response.data.cartoons.length; i++){
						response.data.cartoons[i].cartoon_cover = that.baseUrl + response.data.cartoons[i].cartoon_cover;
						response.data.cartoons[i].cartoon_showImg = that.baseUrl + response.data.cartoons[i].cartoon_showImg;
					}
				}).catch((err)=>{
					console.log("err",err);
				});
    		},
    		toDetail(cartoon_id){
    			this.$router.push('/cartoonDetail/' + cartoon_id);
    		}
		},
		mounted(){
			this.initTab();
			this.initUI(this.week[0].value);
		},
		components:{
			Tab,
			TabItem,
			Sticky,
			Divider,
			XButton,
			Swiper,
			SwiperItem,
			XImg,
			Badge,
			Flexbox,
			FlexboxItem
		}
	}
</script>

<style scoped>
	.item-container{
		width: 100%;
		height: 250px;
	}

	.item-img{
		height: 200px;
		width: 100%;
		overflow: hidden;
	}

	.item-desc{
		width: 100%;
		height: 50px;
	}


</style>