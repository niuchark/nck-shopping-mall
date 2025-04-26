import Vue from 'vue'
import VueRouter from 'vue-router'
// 如果组件文件夹下以index开头，则可以直接引入文件夹。相当于只填文件夹名会自动寻找index.js引入
import Layout from '@/views/layout'
import Search from '@/views/search'
import SearchList from '@/views/search/list'
import ProDetail from '@/views/prodetail'
import Login from '@/views/login'
import Pay from '@/views/pay'
import MyOrder from '@/views/myorder'

import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

import store from '@/store' // 引入vuex的store

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'category',
        component: Category
      },
      {
        path: 'cart',
        component: Cart
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/searchlist',
    component: SearchList
  },
  {
    path: '/prodetail/:id',
    component: ProDetail
  },
  {
    path: '/pay',
    component: Pay
  },
  {
    path: '/myorder',
    component: MyOrder
  }]
})

// 所有的路由在被真正访问到之前（解析渲染对应组件页面前），都会经过全局前置守卫
// 只有全局前置守卫放行了，才会达到对应的页面

// 全局前置守卫
// to: 要去的路由对象,要去的完整路由信息对象
// from: 从哪个路由对象跳转过来的
// next(): 是否放行
// next()放行，放行到to要去的路径
// next(路径)不放行，进行拦截，拦截到指定的路径next里面配置的路径

// 定义一个数组，专门存放用户需要权限访问的页面
const authUrls = ['/pay', '/myorder']

router.beforeEach((to, from, next) => {
  if (!authUrls.includes(to.path)) { // to.path是要去的路由路径，不带参数，fullpath是带参数的
    // 非权限页面，直接放行
    next()
  }
  // 权限页面，需要判断token
  const token = store.getters.token
  if (!token) {
    // 没有token，跳转到登录页
    next('/login')
  } else {
    // 有token，放行
    next()
  }
})

export default router
