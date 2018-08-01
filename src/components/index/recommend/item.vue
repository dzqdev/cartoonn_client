<template>
	<div id="item" :style="{ width: ((getWidowWidth-20)/count) + 'px',marginRight: IsRight?0 + 'px':10+'px',float:IsRight?'right':'left',height:itemHeight + 'px',}" @click="toDetail">
		<!-- div的宽度 -->
		<!-- 图片地址 -->
		<!-- 漫画名称 -->
		<!-- 漫画描述 -->
		<!-- 漫画地址 -->
		<!-- 右边距是否需要 -->
		<div class="image" :style="{height:(itemHeight*(3/4)) + 'px'}">
			<p :style="{height:(itemHeight*(3/4)) + 'px'}">
				<img :src="cartoonObject.cartoonBill" v-if="showType == 'bill'">
				<img :src="cartoonObject.cartoonImg" v-if="showType == 'cover'">
			</p>
		</div>

		<div class="description" :style="{height:itemHeight/4 + 'px',lineHeight:itemHeight/8 + 'px'}">
			<span class="cartoonName" :style="{height:itemHeight/8 + 'px'}">
				<strong>{{cartoonObject.cartoonName}}</strong>
			</span>
			<span class="cartoonDesc" :style="{height:itemHeight/8 + 'px',lineHeight:itemHeight/8 + 'px'}">
				{{cartoonObject.cartoonDesc}}
			</span>
		</div>
		
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
	export default{
		props:{
			cartoonObject:{
				type:Object,
				require:true
			},
			count:{
				type:Number,
				require:true
			},
			IsRight:{
				type:Boolean
			},
			itemHeight:{
				type:Number,
				require:true
			},
			showType:{
				type:String,
				require:true
			}
		},
		computed:{
			...mapGetters([
				'getWidowWidth'
			])
		},
		methods:{
			toDetail(){
		         this.$router.push({
		          path: `/cartoonDetail/${this.cartoonObject.cartoonId}`,
		        })
			}
		}
	}
</script>

<style scoped>
	#item{
		float: left;
		margin-bottom: 10px;
	}

	.image{
		width: 100%;
		text-align: left;
	}

	.image p{
		width: 100%;
		text-align: center;
		overflow: hidden;
		background-position: -100px -50px;
	}

	.image p img{
		height: 100%;
	    vertical-align:middle;
	    text-align: center;

	}

	.description{
		width: 100%;
		text-align: left;
	}

	.description span{
		display: block;
		text-align:left;
		font-size: 12px;
		overflow: hidden;
		color: #777;
	}

	.cartoonName{
		line-height: 30px;
	}
</style>