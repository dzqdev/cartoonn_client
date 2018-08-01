import Vue from 'vue'
import Router from 'vue-router'
//根链接
import IndexVue from '@/components/index/index';
import BookCaseVue from '@/components/bookcase/bookcase';
import CommunityVue from '@/components/community/community';
import MeVue from '@/components/me/me';

//工具ui
import NetError from '@/components/global/net_error'

//其他链接
import SearchVue from '@/components/index/recommend/search'
import CategoryVue from '@/components/index/category/category'
import RecommendMoreInfoVue from '@/components/index/recommend/ItemAllRecommend'

/**
 * 漫画详情
 */
import CartoonDetailVue from '@/components/index/cartoonDetail/cartoonDetail'
import RaterVue from '@/components/index/cartoonDetail/cartoonRater'
import CartoonChapterWatchVue from '@/components/index/cartoonDetail/cartoonChapterWatch'
import PublishChapterCommentVue from '@/components/index/cartoonDetail/publishChapterComment'
/**
 * 社区
 */
import CommunityDetailVue from '@/components/community/communityDetail'
import PublishCommunityVue from '@/components/community/publishCommunity'
/**
 * 我的
 */
//登录注册
import LoginVue from '@/components/me/login'
import RegisterVue from '@/components/me/register'
//关注
import AttentionVue from '@/components/me/Attention'
import MeSpaceVue from '@/components/me/meSpace'
import TopicVue from '@/components/me/meTopic'
import MessageVue from '@/components/me/meMessage'
import SetUpVue from '@/components/me/setUp'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexVue',
      // component: IndexVue,
      component:resolve => require(['@/components/index/index'],resolve),
      meta:{
        keepAlive:true
      }
    },
    {
      path:'/search',
      name:"SearchVue",
      component:SearchVue
    },
    {
      path: '/category',
      name: 'CategoryVue',
      component: CategoryVue
    },
    {
      path:'/more/:type',
      component:RecommendMoreInfoVue
    },
    {
      path: '/cartoonDetail/:cartoonId',
      name: 'CartoonDetailVue',
      component: CartoonDetailVue
    },
    {
      path:'/cartoonDetail/publishComment/:chapterId',
      component:PublishChapterCommentVue
    },
    //评分页面
    {
      path:'/cartoonDetail/:cartoonId/rater',
      name: 'RaterVue',
      component:RaterVue
    },
    //某一章的页面
    {
      path:'/cartoonDetail/chapter/:cartoonId/:chapterId',
      component:CartoonChapterWatchVue
    },
    {
      path: '/bookcase',
      name: 'BookCaseVue',
      component:resolve => require(['@/components/bookcase/bookcase'],resolve),
      meta:{
        keepAlive:true
      }
    },
    {
      path: '/community',
      name: 'CommunityVue',
      // component: CommunityVue,
      component:resolve => require(['@/components/community/community'],resolve),
      meta:{
        keepAlive:true
      }
    },
    {
      path:'/community/detail/:topic_id',
      component:CommunityDetailVue
    },
    {
      path:'/community/publish',
      component:PublishCommunityVue
    },
    {
      path: '/me',
      name: 'MeVue',
      component: MeVue
    },
    {
      path: '/me/login',
      name: 'LoginVue',
      component: LoginVue
    },
    {
      path: '/me/register',
      name: 'RegisterVue',
      component: RegisterVue
    },
    {
      path:'/me/attention',
      component:AttentionVue
    },
    {
      path:'/me/MeSpace/:userId',
      component:MeSpaceVue
    },
    {
      path:'/me/topic/:userId',
      component:TopicVue
    },
    {
      path:'/me/message/:userId',
      component:MessageVue
    },
    {
      path:'/me/setUp',
      component:SetUpVue
    },
    {
      path:'/net_error',
      component:NetError
    }
  ]
})
