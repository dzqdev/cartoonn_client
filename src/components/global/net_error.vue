<template>
	<div id="net_err">
		<div class="content">
			<img src="/static/net_err.jpg">
			<span class="title">
				请检查网络连接
			</span>
			 <x-button mini type="primary" @click.native="reflesh">重新连接</x-button>
		</div>
	</div>
</template>

<script>
import { XButton } from 'vux'
	export default{
		components: {
		   XButton
		},
		mounted(){
		},
		methods:{
			reflesh(){
				this.$router.push('/');
			}
		}
	}
</script>

<style scoped>
	.content{
		width: 100%;
		height: 200px;
		margin: 0 auto;
		margin-top: 30%;
	}

	.content img{
		width: auto;
		height: 150px;
	}

	.title{
		display: block;
		width: 100%;
		height: 50px;
		font-size: 20px;
		color: #666;
		font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu
	}
</style>