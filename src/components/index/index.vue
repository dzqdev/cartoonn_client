<template>
    <div id="index">
        <!-- <loading :show="isShow"></loading> -->
        
        <sticky ref="sticky" :offset="0" :check-sticky-support="false" :disabled="disabled">
        	<x-header style="background-color:#fff;" :left-options="{showBack: false}">
	        	<tab v-model="itemIndex" prevent-default active-color='#f3890e' @on-before-index-change="switchTabItem">
	                <tab-item>每日更新</tab-item>
	                <tab-item selected>推荐</tab-item>
	            </tab>
	            <a slot="right" @click="search">
	            	<!-- <img src="static/search.png" style="height: 30px;width: 30px"> -->
	            	<icon type="search"></icon>
	            </a>
        	</x-header>
        </sticky>
        <everydateUpdateVue v-show="itemIndex === 0"></everydateUpdateVue>
        <RecommendVue v-show="itemIndex === 1"></RecommendVue>
    </div>
</template>
<script>
//vux组件
import {
    Tab,
    TabItem,
    Loading,
    Swiper,
    SwiperItem,
    XHeader,
    Sticky,
    Icon 
} from 'vux';
//自定义组件
import RecommendVue from './recommend/recommend'
import everydateUpdateVue from './everyday_update/everyday_update'
export default {
    data() {
            return {
                itemIndex: 1,
                isShow: false,
                disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent)
            }
        },
        components: {
            Tab,
            TabItem,
            Loading,
            Swiper,
            SwiperItem,
            XHeader,
            Sticky,
            Icon,
            //自定义
            RecommendVue,
            everydateUpdateVue
        },
        methods: {
            switchTabItem(index) {
                this.itemIndex = index;
            },
            search(){
                this.$router.push('/search');
            }
        }
}
</script>


<style scoped>
.tab {
    position: fixed;
    top: 0;
    z-index: 6666;
}
/*f3890e*/
</style>
