<template>
    <div id="bookcase">

      <div style="height:100%;">
      <view-box ref="viewBox">
        <x-header slot="header" :left-options="{showBack: false}" style="background-color: #fff">
              书架
              <div slot="right" style="color:#FF9900" @click="openDel">{{delText}}</div>
        </x-header>
        <scroller
          use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh"
          lock-x ref="scrollerBottom">
          <div class="bookcaseListContainer" v-if="!edit">
               <div class="cartoonItem" v-for="cartoon in bookShelf" @click="toChapter(cartoon.cartoon_id._id,cartoon.last_watch._id,cartoon._id,cartoon.is_update)">
                    <div class="img">
                       <img :src="cartoon.cartoon_id.cartoon_cover" >
                    </div>
                    <div class="text">
                        <div class="cartoon_name">{{cartoon.cartoon_id.cartoon_name}}
                          <badge text="更新" v-if="cartoon.is_update"></badge>
                        </div>
                        <div class="history" style="color: #ccc;font-size:12px;">{{cartoon.last_watch.chapter_title}}</div>
                    </div>
               </div>
          </div>

          <div class="bookcaseListContainer" v-if="edit">
               <div class="cartoonItem" v-for="cartoon in bookShelf">
                    <div style="position:relative"> 
                      <div style="position:absolute; right:2px; top:0;z-index:10086" @click="deleteRecord(cartoon.cartoon_id._id)">
                       <x-icon type="ios-close" size="30"></x-icon>
                      </div>
                       <img :src="cartoon.cartoon_id.cartoon_cover" >
                    </div>
                    <div class="text">
                        <div class="cartoon_name">{{cartoon.cartoon_id.cartoon_name}}</div>
                        <div class="history" style="color: #ccc;font-size:12px;">{{cartoon.last_watch.chapter_title}}</div>
                    </div>
               </div>
          </div>
          <div class="msg" v-if="bookShelf.length == 0">
              <div class="empty">
              </div>
              <div class="text">
                一本漫画都没有
              </div>
          </div>
        </scroller>
        <div v-transfer-dom>
          <confirm v-model="showComfirm"
          @on-cancel="onCancel"
          @on-confirm="onConfirm">
            <p style="text-align:center;">确定删除吗?</p>
          </confirm>
      </div>
      </view-box>
    </div>
        <!-- <div style="height:100%;">
            <x-header :left-options="{showBack: false}" style="background-color: #fff">
              书架
              <div slot="right" style="color:#FF9900" @click="openDel">{{delText}}</div>
            </x-header>
        </div> -->
    </div>
</template>

<script>
import {
    XHeader,
    Confirm,
    Scroller,
    TransferDomDirective as TransferDom,
    Badge,
    ViewBox
} from 'vux'
 const pulldownDefaultConfig = {
     content: '下拉刷新',
     height: 40,
     autoRefresh: false,
     downContent: '下拉刷新',
     upContent: '释放后刷新',
     loadingContent: '正在刷新...',
     clsPrefix: 'xs-plugin-pulldown-'
 }

import {mapGetters,mapActions} from 'vuex'
export default {
    inject:['reload'],
    directives: {
      TransferDom
    },
    data() {
        return {
            bookShelf:'',
            pulldownDefaultConfig: pulldownDefaultConfig,
            edit:false,
            delText:"筛选",
            showComfirm:false,
            deleteCartoonRecord:''
        }
    },
    methods:{
        //获取书架的信息
        getBookShelf(){
            var _this = this;
            let user_id = _this.getStorage.text['_id'];
            _this.axios.get('/bookShelf/findBookShelf/' + user_id, {
              params: {
              }
            })
            .then(function (response) {
                if(response.data.msg.status == "ok"){
                    for(let i = 0; i < response.data.msg['text'].length; i++){
                        response.data.msg['text'][i].cartoon_id.cartoon_cover = 
                        _this.baseUrl + response.data.msg['text'][i].cartoon_id.cartoon_cover;
                    }

                    _this.bookShelf = response.data.msg['text'];
                }
            })
            .catch(function (err) {
              console.log("err: " + err);
            });
        },
        toChapter(cartoonId,chapterId,bookShelfId,isUpdate){
            //将漫画的已经更新设置为false
            let _this = this;
            _this.$store.dispatch("UpdateBookCase",false);
            if(isUpdate){
              var url = '/bookShelf/updateStatus'
              var params = new URLSearchParams();
              params.append('bookShelfId', bookShelfId);
              _this.axios({
                  method: 'post',
                  url:url,
                  data:params
              }).then((res)=>{
                console.log("res",res);
              });
            }
            _this.$router.push('/cartoonDetail/chapter/' +  cartoonId + '/' + chapterId);
            // console.log(cartoonId,chapterId);
        },
        refresh() {
            this.reload();
        },
        deleteRecord(id) {
          this.deleteCartoonRecord = id;
          this.showComfirm = true;
        },
        openDel(){
          let _this = this;
          if(!_this.edit){
            //变为进入删除
            _this.edit = true;
            _this.delText = "取消";
          }else{
            _this.edit = false;
            _this.delText = "筛选";
          }
        },
        onConfirm(){
          let _this = this;
          let user_id = _this.getStorage.text._id;
          let cartoon_id = _this.deleteCartoonRecord;

          var url = '/bookShelf/unCollect'
            var params = new URLSearchParams();
            params.append('cartoon_id', cartoon_id);
            params.append('user_id', user_id); 
            _this.axios({
                method: 'post',
                url:url,
                data:params
            }).then((res)=>{
              if(res.data.msg.status == "ok"){
                _this.$vux.toast.show({
                    text: '删除成功',
                    onHide () {
                     _this.reload();
                    }
                })
              }
          });
        },
        onCancel(){
          this.showComfirm = false;
        }
    },
    mounted(){
        this.getBookShelf();
        this.$nextTick(() => {
         this.$refs.scrollerBottom.reset({top: 0})
        })
    },
    components: {
        XHeader,
        Scroller,
        Confirm,
        Badge,
        ViewBox
    },
    computed:{
        ...mapGetters([
            'getStorage'
        ])
    }
}
</script>
<style scoped>
html,
body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
}

#bookcase {
    width: 100%;
    height: 100%;
}

.bookcaseListContainer{
    width: 100%;
    border-top: 1px solid #efefef;
    height: 100%;
}

.cartoonItem{
    width: 30%;
    margin-right: 3%;
    height: auto;
    float: left;
    overflow: hidden;
    margin-top:0;
    margin-bottom: 20px;
}

.cartoonItem img{
  position: relative;
    width: auto;
    height: 150px;
    overflow: hidden;
}

.cartoonItem .text{
    width: 100%;
    height: 40px;
    font-size: 15px;
}

.msg{
    margin-top: 100px;
  }

  .empty{
    width: 250px;
    height: 150px;
    margin: 0 auto;
    overflow: hidden;
    background: url('/static/empty.jpg') no-repeat -20px -20px;
  }

  .text{
    width: 250px;
    margin: 0 auto;
    font-size: 16px;
    color: #666;
  }

.vux-x-icon {
  fill: #FF9900;
}
</style>
