<template>
	<div id="footer" v-show="getFooterStatus">
		<tabbar>
	      <tabbar-item link="/" :selected="$route.name === 'IndexVue'">
	        <img slot="icon" src="static/index.png">
	        <span slot="label">首页</span>
	      </tabbar-item>
	      <tabbar-item :show-dot='getUpdateBookCase' link="/bookcase" :selected="$route.name === 'BookCaseVue'">
	        <img slot="icon" src="static/bookcase.png">
	        <span slot="label">书架</span>
	      </tabbar-item>
	      <tabbar-item link="/community" :selected="$route.name === 'CommunityVue'">
	        <img slot="icon" src="static/community.png">
	        <span slot="label">社区</span>
	      </tabbar-item>
	      <tabbar-item link="/me" :selected="$route.name === 'MeVue'">
	        <img slot="icon" src="static/me.png">
	        <span slot="label">我的</span>
	      </tabbar-item>
	    </tabbar>
	</div>
</template>

<script>
import { Tabbar, TabbarItem} from 'vux'
import {mapGetters,mapActions} from 'vuex'
	export default{
		data(){
			return{
			}
		},
		methods:{
			
		},
		computed:{
			...mapGetters([
				'getFooterStatus',
				'getUpdateBookCase'
			])
		},
		components:{
			Tabbar,
    		TabbarItem
		},
		mounted(){
			
		}
	}
</script>

<style scoped>
.weui-tabbar {
    position: fixed !important;
  }

  #footer{
  }
</style>