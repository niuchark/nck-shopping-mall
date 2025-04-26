import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () { // state可以写成对象，也可以写成函数来return数据。推荐return函数，避免数据共享的问题
    return {
      // 个人权证相关
      userInfo: getInfo() // 从本地存储获取用户信息，拿不到方法内也会获取默认值
    }
  },
  mutations: {
    // 所有的mutations第一个参数都是state，第二个参数是传入的参数
    setUserInfo (state, obj) {
      state.userInfo = obj // 用户信息存入vuex
      setInfo(obj) // 用户信息存入localStorage本地
    }
  },
  actions: {
    // 登录
    async login ({ commit }, data) {
      const res = await this.$http.post('/login', data)
      commit('setToken', res.data.token)
      commit('setUserInfo', res.data.userInfo)
    },
    logout (context) {
      // 个人信息要重置
      context.commit('setUserInfo', {})

      // 购物车数据要重置 （跨模块调用 mutation） cart/setCartList
      context.commit('cart/setCartList', [], { root: true }) // 传递一个空数组[]，清空购物车数据
    }
  }
}
