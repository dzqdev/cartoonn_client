<template>
    <div id="community">
        <sticky ref="sticky" :offset="0" :check-sticky-support="false" :disabled="disabled">
            <x-header :left-options="{showBack: false}" style="background-color:#fff;">
                <div class="overwrite-title-demo" slot="overwrite-title">
                    <tab active-color="#FF9900">
                        <tab-item selected @on-item-click="onItemClick">大神</tab-item>
                        <tab-item @on-item-click="onItemClick">关注</tab-item>
                    </tab>
                </div>
               <x-icon type="ios-plus-outline" size="30" slot="right" @click.native="toPublish"></x-icon>
            </x-header>
        </sticky>
        
        <scroller use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh"
          lock-x ref="scrollerBottom" height="600">
          <div >
          <!-- scroller -->
            <div class="leftMenu" v-show="selectedIndex == 0" >
                <div class="msg" v-if="topicList.length == 0">
                    <div class="empty">
                    </div>
                    <div class="text">
                        一个话题都没有
                    </div>
                </div>
                <div class="item" v-for="topic in topicList">
                    <div class="top">
                        <div class="imgBox">
                            <img :src="topic.user_id.user_img">
                        </div>
                        <div class="userNameBox">
                            <strong>{{topic.user_id.user_name}}</strong>
                        </div>
                        <div class="attention">
                            <x-button plain mini type="warn" style="border-radius:99px;float:right" v-show="topic.user_id._id != getStorage.text._id" @click.native='attention(topic.user_id._id)'>关注</x-button>
                        </div>
                    </div>
                    <div @click="toDetail(topic._id)">
                        <div class="bottom" >
                            <flexbox>
                                <flexbox-item>
                                    <div class="messageBox">
                                        {{topic.text_content}}
                                    </div>
                                    <div class="msgImageBox" v-show="topic.image_content.length > 0 ">
                                        <img  v-for="image in topic.image_content" :src="image">
                                    </div>
                                </flexbox-item>
                            </flexbox>
                        </div>
                        <div class="info">
                            <div class="time">
                                {{dateformat(topic.post_time)}}
                            </div>
                            <div class="operation">
                                <div>
                                    <span class="commentCount">
                                        <img src="static/comment.png">
                                    </span>
                                    {{topic.comment.length}}
                                </div>
                                <div>
                                    <span class="agreeCount">
                                        <img src="static/agree.png">
                                    </span>
                                    {{topic.agree_list.length}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="divide"></div>
                </div>
            </div>
            <!-- 右边 -->
            <div class="rightMenu" v-show="selectedIndex == 1" style="margin-bottom: 20px;">
                <div class="msg" v-if="attentionTopicList.length == 0">
                    <div class="empty">
                    </div>
                    <div class="text">
                        一个关注的都没有
                    </div>
                </div>
                <div class="item" v-for="attention in attentionTopicList">
                    <div class="top">
                        <div class="imgBox">
                            <img :src="attention.user_id.user_img">
                        </div>
                        <div class="userNameBox">
                            <strong>{{attention.user_id.user_name}}</strong>
                        </div>
                    </div>
                    <div @click="toDetail(attention._id)">
                        <div class="bottom">
                            <flexbox>
                                <flexbox-item>
                                    <div class="messageBox">
                                        {{attention.text_content}}
                                    </div>
                                    <div class="msgImageBox" v-show="attention.image_content.length > 0 ">
                                        <img  v-for="image in attention.image_content" :src="image">
                                    </div>
                                </flexbox-item>
                            </flexbox>
                        </div>
                        <div class="info">
                            <div class="time">
                                {{dateformat(attention.post_time)}}
                            </div>
                            <div class="operation">
                                <div>
                                    <span class="commentCount">
                                        <img src="static/comment.png">
                                    </span>
                                        {{attention.comment.length}}
                                </div>
                                <div>
                                    <span class="agreeCount">
                                        <img src="static/agree.png">
                                    </span>
                                    {{attention.agree_list == ''?0:attention.agree_list.length}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="divide"></div>
                </div>
            </div>
        </div>
        </scroller>
       
    </div>
</template>
<script>
import {
    Flexbox,
    FlexboxItem,
    XButton,
    XHeader,
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem,
    Scroller
} from 'vux';

 const pulldownDefaultConfig = {
     content: '下拉刷新',
     height:40,
     autoRefresh: false,
     downContent: '下拉刷新',
     upContent: '释放后刷新',
     loadingContent: '正在刷新...',
     clsPrefix: 'xs-plugin-pulldown-'
 }
import {mapGetters} from 'vuex';
export default {
        inject:['reload'],
        data() {
            return {
                selectedIndex: 0,
                disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
                topicList:'',
                attentionTopicList:'',
                pulldownDefaultConfig: pulldownDefaultConfig
            }
        },
        methods: {
            onItemClick(index) {
                this.selectedIndex = index;
                if(index == 0){
                    this.initData();
                }else if(index == 1){
                    this.getAttentionData();
                }
            },
            toDetail(topic_id){
                this.$router.push('/community/detail/' + topic_id);
            },
            toPublish(){
                this.$router.push('/community/publish');
            },
            initData(){
                var _this = this;
                _this.axios.get('/topic/findAllExitComment/' + _this.getStorage.text._id, {
                  params: {}
                })
                .then(function (response) {
                    if(response.data.msg.status == "ok"){
                        //用户头像地址变更
                        for(let i = 0; i < response.data.msg.topic.length; i++){
                            response.data.msg.topic[i].user_id.user_img = _this.baseUrl + response.data.msg.topic[i].user_id.user_img;
                        }
                        //所有的未关注话题的图片的地址变更
                        for(let j = 0; j < response.data.msg.topic.length; j++){
                            for(let k = 0 ; k <response.data.msg.topic[j].image_content.length; k++){
                                response.data.msg.topic[j].image_content[k] = _this.baseUrl + response.data.msg.topic[j].image_content[k];
                            }
                        }
                        _this.topicList = response.data.msg.topic;

                        //所有已经关注的话题的图片的地址b变更
                        

                    }
                })
                .catch(function (err) {
                  console.log("err: " + err);
              });
            },
            attention(attentionUserId){
                let _this = this;
                //当前用户的id
                let currentUser = _this.getStorage.text._id;
                //提交关注
                var url = '/user/attention'
                var params = new URLSearchParams();
                params.append('userId', currentUser);
                params.append('attentionUserId', attentionUserId); 
                _this.axios({
                    method: 'post',
                    url:url,
                    data:params
                }).then((res)=>{
                    if(res.data.msg.status == "ok"){
                        _this.$vux.toast.show({
                            text: '关注成功',
                            onHide () {
                             _this.reload();
                            }
                        })
                    }
                });
            },
            getAttentionData(){
                 var _this = this;
                _this.axios.get('/topic/findUserAttention/' + _this.getStorage.text._id, {
                  params: {}
                })
                .then(function (response) {
                    if(response.data.msg.status == "ok"){
                        //查询成功
                        if(response.data.msg.topic == null){
                            _this.attentionTopicList = [];
                        }else{
                            for(let j = 0; j < response.data.msg.topic.length; j++){
                                response.data.msg.topic[j].user_id.user_img = _this.baseUrl + response.data.msg.topic[j].user_id.user_img;
                            }

                            //所有的未关注话题的图片的地址变更
                            for(let j = 0; j < response.data.msg.topic.length; j++){
                                for(let k = 0 ; k <response.data.msg.topic[j].image_content.length; k++){
                                    response.data.msg.topic[j].image_content[k] = _this.baseUrl + response.data.msg.topic[j].image_content[k];
                                    response.data.msg.topic[j].isAttention = true;
                                }
                            }
                            _this.attentionTopicList = response.data.msg.topic;
                        }
                    }
                })
                .catch(function (err) {
                  console.log("err: " + err);
              });
            },
            refresh() { 
                this.reload();
            },
            loadMore() {
              
            }
        },
        components: {
            Flexbox,
            FlexboxItem,
            XButton,
            XHeader,
            Tab,
            TabItem,
            Sticky,
            Swiper,
            SwiperItem,
            Scroller
        },
        mounted(){
            this.initData();
            this.$nextTick(() => {
             this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        computed:{
            ...mapGetters([
                'getStorage'
            ])
        }
}
</script>
<style scoped>
.vux-x-icon {
  fill: #FF9900;
}

.item {
    /*min-height: 300px;*/
    border: 1px solid #ccc;
}

.top {
    width: 100%;
    padding-left: 5%;
    padding-right: 5%;
    height: 70px;
    padding-top: 15px;
    margin: 0 auto;
    text-align: center;
}

.top .imgBox {
    width: 50px;
    height: 50px;
    float: left;
}

.top .imgBox img {
    height: 100%;
    width: 100%;
    border-radius: 50%
}

.top .userNameBox {
    height: 50px;
    line-height: 50px;
    float: left;
    padding-left: 20px;
    font-size: 15px;
}

.top .attention {
    float: right;
    height: 40px;
    padding-top: 10px;
}

.bottom {
    width: 100%;
    padding-left: 5%;
    padding-right: 5%;
    height: auto;
}

.messageBox {
    min-height: 20px;
    width: 100%;
    line-height: 20px;
    text-align: left;
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.msgImageBox {
    margin-top: 10px;
    overflow: hidden;
    vertical-align:middle;
    display: table-cell;
}

.msgImageBox img {
    max-width: 100%;
    height: 100px;
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
}

.info {
    width: 100%;
    padding-left: 5%;
    padding-right: 5%;
    height: 40px;
}

.info .time {
    float: left;
    line-height: 40px;
}

.info .operation {
    float: right;
    width: 40%;
}

.operation div{
    display: block;
    width: 45%;
    height: 100%;
    float: left;
    line-height: 40px;
    font-size: 16px;
    margin-right: 5%;
}

.operation div span{
    display: block;
    width: 50%;
    float: left;
    height: 40px;
    padding-top: 5px;
}

.operation div span img{
    width: 20px;
    height: 20px;
}

.msg{
    margin-top: 100px;
}

.empty{
    width: 250px;
    height: 150px;
    margin: 0 auto;
    overflow: hidden;
    background: url('../../../static/empty.jpg') no-repeat -20px -20px;
}

.text{
    width: 250px;
    margin: 0 auto;
    font-size: 16px;
    color: #666;
}

.divide {
    width: 100%;
    height: 10px;
    background-color: #efeff4;
    float: left;
}
</style>
