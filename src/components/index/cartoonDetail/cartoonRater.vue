<template>
	<div id="rate">
		 <x-header :left-options="{backText: ''}" style="background-color: #fff;z-index: 10086;">
            <p style="color:#000">漫画评分</p>
            <p @click="post" slot="right" style="color:#FF9900;">发表</p>
        </x-header>
		<rater v-model="rater" star="✩" active-color="#FF9900" :margin="4"></rater>
	</div>
</template>

<script>
import { Rater,XHeader } from 'vux'
	export default{
		data(){
			return{
				rater:0
			}
		},
		components: {
		   Rater,
		   XHeader
		},
		methods:{
			post(){

			}
		}
	}
</script>

<style scoped>
	
</style>