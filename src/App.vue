<template>
    <div id="app">
      <loading :show="getLoading" :text="loadText" ></loading>
      <ViewBox v-if="isRouterAlive">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </ViewBox>
      <FooterVue v-if="isRouterAlive"></FooterVue>
    </div>
</template>
<script>
//自定义组件
import IndexVue from '@/components/index/index'
import FooterVue from '@/components/global/Footer'
//外部Ui
import { ViewBox,Loading } from 'vux'
//vuex
import {mapActions,mapGetters} from 'vuex'

export default {
  name: 'App',
  data(){
    return{
      isRouterAlive:true,
      loadText:"正在加载"
    }
  },
  provide(){
    return{
      reload: this.reload
    }
  },
  components: {
    IndexVue,
    FooterVue,
    ViewBox,
    Loading 
  },
  created(){
    //获取网页宽度
    var width = $(window).width();
    this.set_window_width(width);
    //设置底部栏是否显示
    this.changeFooter();
    //加入登录状态
    //判断登录是否存在
    this.setLoginStatus();
  },
  mounted(){
    //查询是否有更新
    //获取用户id
    if(sessionStorage.getItem('user')){
      this.bookcaseUpdate(this.getStorage.text._id);
    }
    
  },
  methods:{
    ...mapActions([
      'set_window_width'
    ]),
    changeFooter(){
      var rootUrl = ['/','/bookcase','/community','/me'];
      var currentUrl = this.$route.path;
      var isMarry = false;
      for(let i = 0; i < rootUrl.length;i++){
        if(currentUrl == rootUrl[i]){
          this.$store.dispatch("set_footer_status",true);
          isMarry = true;
          break;
        }
      }
      if(!isMarry){
        this.$store.dispatch("set_footer_status",false);
      }
    },
    //加入登录状态
    setLoginStatus(){
      //获取localStorage中信息
      if(sessionStorage.getItem('user')){
         let user = JSON.parse(sessionStorage.getItem('user'));
        this.$store.dispatch("set_storage",user);
      }else{
        let path = this.$route.path;
        if(path == "/me/register"){
          this.$router.push('/me/register');  
        }else{
          this.$router.push('/me/login');
        }
      }
    },
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      });
      this.bookcaseUpdate(this.getStorage.text._id);
    },
    //判断书架是否有更新
    bookcaseUpdate(userId){
      var _this = this;
      _this.axios.get('/bookShelf/getBookCaseUpdateInfo/' + userId, {
        params: {
        }
      })
      .then(function (response) {
          if(response.data.msg.status == true){
             _this.$store.dispatch("UpdateBookCase",true);
          }else{
            _this.$store.dispatch("UpdateBookCase",false);
          }
      })
      .catch(function (err) {
        console.log("err: " + err);
      });
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    "$route": ["changeFooter","setLoginStatus"]
  },
  computed:{
    ...mapGetters([
      'getLoading',
      'getStorage'
    ])
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding: 0;
    margin: 0;
}
</style>

