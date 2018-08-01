<template>
	<div id="publishChapterComment">
		 <x-header :left-options="{backText: ''}" style="background-color: #fff">
            <p style="color:#000"> 发表评论</p>
           <div @click="post" slot="right" style="color:#FF9900">发表</div>
        </x-header>
		<group gutter="0">
	       <x-textarea  :max="200" :placeholder="'吐槽神马的放马过来吧'" :height="200" :rows="8" :cols="30" v-model="text_area_value"></x-textarea>
	       <toast v-model="showToast" text="评论成功"></toast>
	    </group>
	</div>
</template>

<script>
import { XTextarea, Group,XHeader,XButton,Toast } from 'vux';
import {mapGetters} from 'vuex';
	export default{
		data(){
			return{
				text_area_value:'',
				showToast:false
			}
		},
		components:{
			XTextarea, Group,XHeader,XButton,Toast
		},
		methods:{
			onEvent (event) {
			    console.log('on', event)
			},
			post(){
				//章节id
				//评论内容
				//评论用户
				let _this = this;
				//章节id
				let chapterId = _this.$route.params.chapterId;
				console.log("章节id",chapterId);
				var url = '/cartoon/chapter/saveComment'
				var params = new URLSearchParams();
				params.append('post_userid', _this.getStorage.text._id);
				params.append('comment_content', _this.text_area_value);
				params.append('chapterId', chapterId); 
				_this.axios({
				    method: 'post',
				    url:url,
				    data:params
				}).then((res)=>{
					console.log(res)
				    if(res.data.msg.status == "ok"){
				    	_this.showToast = true;
				    	setTimeout(function(){
				    		_this.$router.go(-1);
				    	},1000)
				    }
				});
			}
		},
		computed:{
			...mapGetters([
				'getStorage'
			])
		}
	}
</script>

<style scoped>
	#publishCommunity{
		padding: 0;
		margin: 0;
	}
</style>