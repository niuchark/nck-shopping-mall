import request from '@/utils/request'

// 加入购物车
// goodsId 商品id
// goodsNum 商品数量
// goodsSkuId 商品规格id 比如红色苹果8和粉色苹果8
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

export const getCartList = () => {
  return request.get('/cart/list')
}

// 更新购物车商品的数量
export const changeCount = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

export const delSelect = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds
  })
}
