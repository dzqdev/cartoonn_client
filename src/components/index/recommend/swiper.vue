<template>
	<div id="swiper">
		 <swiper loop auto :list="imgList" ></swiper>
	</div>
</template>

<script>
import { Swiper } from 'vux'
	export default{
		data(){
			return{
				imgList:[]
			}
		},
		components:{
			Swiper
		},
		mounted(){
			this.getBanner();
		},
		methods:{
			getBanner(){
				var _this = this;
				_this.axios.get('/recommend/allBanner', {
		          params: {}
		        })
		        .then(function (response) {
		        	for(let i = 0; i < response.data.banners.length; i++){
		        		_this.imgList.push({
		        			url: 'javascript:',
		        			img: _this.baseUrl + response.data.banners[i].banner_url
		        		});
		        	}
		        })
		        .catch(function (err) {
		          console.log("err: " + err);
		      });
			}
		}
	}
</script>

<style scoped>

</style>