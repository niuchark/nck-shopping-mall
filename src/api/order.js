import request from '@/utils/request'

// 订单结算确认
// mode: cart    => obj { cartIds }
// mode: buyNow  => obj { goodsId, goodsNum, goodsSkuId, remark }
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode, // cart 购物车结算，buy 直接购买
      delivery: 10, // 10 快递配送 20 自提
      coupondId: 0, // 优惠券ID，传0表示不使用优惠券
      isUsePoints: 0, // 传0表示不使用积分
      ...obj // 将传进来的其他参数动态展开，因为buyNOw模式下需要传入商品ID和数量
    }
  })
}

// 提交订单
// mode: cart    => obj { cartIds, remark }
// mode: buyNow  => obj { goodsId, goodsNum, goodsSkuId, remark }
export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10, // 10 快递配送 20 自提
    coupondId: 0,
    isUsePoints: 0,
    payType: 10, // 余额支付
    ...obj
  })
}

// 订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page // List
    }
  })
}
