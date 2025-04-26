
import store from '@/store' // 引入vuex的store
import axios from 'axios'
import { Toast } from 'vant' // 引入vant的Toast组件
// 创建axios实例，对将来创建出来的实例进行自定义配置
// 好处：不会污染原始的axios实例，每次都可以基于它创建新的实例
const instance = axios.create({
  baseURL: 'https://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: {
    platform: 'H5'
  }
})

// 自定义配置 - 请求、响应 拦截器等
// 添加请求拦截器
instance.interceptors.request.use(function (config) { // 官网赋值的是给原本import axios的实例添加的拦截器，不是给const instance添加的拦截器。所以要把axios换成instance
  // 在发送请求之前做些什么
  // 开启loading ， 禁止背景点击
  Toast.loading({
    message: '加载中...',
    forbidClick: true, // 禁止背景点击
    loadingType: 'spinner', // 配置loading图标
    duration: 0 // 持续时间，0表示不会自动消失，等响应回来时再手动关掉它
  })

  // 只要有token，就在请求时携带，便于请求需要授权的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token // config是请求的配置项，因为带特殊字符-，所以要用中括号语法包起来 ['Access-Token']
    config.headers.platform = 'H5'
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触
  // 默认axios会多包一层data，所以这里要取出data
  const res = response.data // 这里的response是axios的响应对象，里面有很多属性，比如status、message、data等
  if (res.status !== 200) {
    // 给错误提示，Toast默认是单例模式，调用多次会覆盖之前的提示，即同时只会有一个提示框
    Toast(res.message || '请求失败') // 这里的message是后端返回的提示信息
    // 抛出一个错误的promise，后续catch可以捕获到这个错误
    return Promise.reject(res.message || '请求失败')
  } else {
    // 正确情况，直接走业务核心逻辑
    Toast.clear() // 关闭loading
  }
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 导出配置好的axios实例
export default instance
