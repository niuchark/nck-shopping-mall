import { getCartList, changeCount, delSelect } from '@/api/cart.js'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      cartList: [], // 购物车列表数据
      cartCount: 0 // 购物车数量
    }
  },
  mutations: {
    // 提供一个设置 cartList 的mutation
    setCartList (state, cartList) {
      state.cartList = cartList // 设置购物车列表数据
    },
    // 让对应的项的状态取反
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck (state, flag) {
      // 让所有的小选框同步设置
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    changeCount (state, { goodsId, goodsNum }) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    // 获取购物车列表数据
    async getCartAction (context) {
      const { data } = await getCartList()
      // 后台返回的数据中，不包含复选框的选中状态，为了实现将来的功能
      // 需要手动维护数据，给每一项，添加一个 isChecked 状态 (标记当前商品是否选中)
      data.list.forEach(item => {
        item.isChecked = true // 给每一项添加属性并赋值，默认选中
      })
      context.commit('setCartList', data.list) // 提交 mutation 设置 cartList
    },
    async changeCountAction (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      // 先本地修改
      context.commit('changeCount', { goodsId, goodsNum })
      // 再同步到后台服务器
      await changeCount(goodsId, goodsNum, goodsSkuId)
    },
    async delSelect (context) {
      const selCartList = context.getters.selCartList // 获取选中的商品项
      const cartIds = selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('删除成功')

      // 重新拉取最新的购物车数据
      context.dispatch('getCartAction')
    }
  },
  // getters中的方法除了state参数还可以通过getters参数访问其他getters中的方法属性
  getters: {
    // 求所有的商品累加总数
    cartTotal (state) {
      return state.cartList.reduce((total, item) => total + item.goods_num, 0)
    },

    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked) // 过滤出选中的商品项
    },

    // 求选中商品的总数量
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },

    // 选中的商品总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },

    // 是否全选
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked) // every 是看每一个箭头函数返回的都是true，是则返回true
    }
  }
}
