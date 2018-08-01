// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//公共组件
import Vue from 'vue'
import App from './App'
import router from './router'
//自定义组件

//外部Ui及工具
import $ from 'jquery';
import axios from 'axios';
import store from './store/store.js'
import  { LoadingPlugin,ToastPlugin } from 'vux'
import iView from 'iview';
import 'iview/dist/styles/iview.css';


//vue配置配置
Vue.config.productionTip = false

//axios配置
Vue.prototype.axios = axios
Vue.prototype.baseUrl = "http://localhost:3000"
axios.defaults.baseURL = 'http://localhost:3000/client';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 5000;

//axios拦截http请求
// http request 拦截器
axios.interceptors.request.use(
    config => {
    	//还未登录
        store.dispatch('updateLoading', true)
    	let user = JSON.parse(sessionStorage.getItem('user'));
        //判断地址是否包含注册登录请求
        let url = config.url;

        if(url.indexOf('login') > -1 || url.indexOf('register') > -1){
            config.headers.Authorization = 'null';
        }else{
            if(user == null){
                router.replace({
                    path: '/me/login'
                })
            }else{
                if (user.token != null) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
                    config.headers.Authorization = `${user.token}`;
                }else{
                    router.replace({
                        path: '/me/login'
                    })
                }
            }
        }

    	
        return config;
    },
    err => {
        return Promise.reject(err);
 });

//响应
axios.interceptors.response.use(
response => {
    // setTimeout(function(){
        store.dispatch('updateLoading', false);
    // },500)
    return response;
},
error => {
    if(error.message == "Network Error"){
        store.dispatch('updateLoading', false);
        router.push({
            path: '/net_error'
            // query: {redirect: router.currentRoute.fullPath}
        })
    }else{
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    // store.commit('removeStorage');
                    sessionStorage.removeItem('user');
                    router.replace({
                        path: '/me/login'
                        // query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
    }
    
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});

//ui插件配置
Vue.use(iView);
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);


//函数库
var moment = require('moment');
Vue.prototype.dateformat = function (date) {
    var result = '';
	var timePublish = new Date(date);
    var timeNow = new Date();
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var diffValue = timeNow - timePublish;
    var diffMonth = diffValue / month;
    var diffWeek = diffValue / (7 * day);
    var diffDay = diffValue / day;
    var diffHour = diffValue / hour;
    var diffMinute = diffValue / minute;

    if (diffValue < 0) {
        alert("错误时间");
    }
    else if (diffMonth > 3) {
        result = timePublish.getFullYear()+"-";
        result += timePublish.getMonth() + "-";
        result += timePublish.getDate();
        alert(result);
    }
    else if (diffMonth > 1) {
        result = parseInt(diffMonth) + "月前";
    }
    else if (diffWeek > 1) {
        result = parseInt(diffWeek) + "周前";
    }
    else if (diffDay > 1) {
        result = parseInt(diffDay) + "天前";
    }
    else if (diffHour > 1) {
        result = parseInt(diffHour) + "小时前";
    }
    else if (diffMinute > 1) {
        result = parseInt(diffMinute) + "分钟前";
    }
    else {
        result = "刚刚";
    }
    return result;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
