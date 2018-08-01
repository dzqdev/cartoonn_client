<template>
    <div id="me">
        <x-header :left-options="{showBack: false}" style="background-color:#fff">
            <p style="color:black">我的</p>
        </x-header>
        <div class="divide"></div>
        <!-- 签到 -->
        <div class="user" @click="meSpace">
            <!-- 用户信息 -->
            <div class="portrait">
                <img :src="getStorage.text.user_img">
            </div>
            <div class="info">
                {{getStorage.text.user_name}}
            </div>
        </div>
        <div class="divide"></div>

        <!-- 列表 -->
        <div class="setup-list">
            <panel :list="topic" :type="type" class="my-list"></panel>       
             <div class="divide"></div>
             <panel :list="other" :type="type" class="my-list"></panel>       
        </div>
        
         
    </div>
</template>
<script>
import { XHeader,Panel,Flexbox,FlexboxItem} from 'vux';
import {mapGetters,mapActions} from 'vuex'
export default {
    data() {
            return {
            	type:'3',
                topic:[{
                   src: 'static/attention.png',
                    title: '我的关注',
                    url: '/me/attention'
                }],
            	other:[
                 {
                    src: 'static/setUp.png',
                    title: '设置',
                    url: '/me/setup'
                }],
            }
        },
        methods: {
            meSpace(){
                this.$router.push('/me/meSpace/' + this.getStorage.text._id);
            }
        },
        components: {
            XHeader,
            Panel,
            Flexbox,
            FlexboxItem
        },
        computed:{
            ...mapGetters([
                'getStorage'
            ])
        },
        mounted(){
            let userId = this.getStorage.text._id;
            this.topic.unshift({
                src: 'static/topic.png',
                title: '我的话题',
                url: '/me/topic/' + userId
            });
            this.other.unshift({
                    src: 'static/msg.png',
                    title: '我的消息',
                    url: '/me/message/' + userId
            });
            this.getStorage.text.user_img = this.baseUrl + this.getStorage.text.user_img;
            this.user = this.getStorage;
        }
}
</script>
<style scoped>
.divide {
    width: 100%;
    height: 10px;
    background-color: #efeff4;
    position: relative;
}

.user {
    height: 80px;
    width: 100%;
    background-color: #fff;
    padding: 10px;
}

.portrait{
    width: 60px;
    height: 60px;
    background-size: cover;
    display: block;
    float: left;
}

.portrait img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 1px 1px 1px rgba(255, 165, 0,.4);
    border:2px solid rgba(255, 165, 0,.3);
}

.info{
    float: left;
    height: 60px;
    text-align: center;
    margin-left: 30px;
    line-height: 60px;
    font-size: 16px;
}

/*话题css*/
.my-list{
	text-align: left;

}

</style>
