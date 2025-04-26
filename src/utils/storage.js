// 约定一个通用的键名
const INFO_KEY = 'hm_shopping_info'
const HISTORY_KEY = 'hm_history_list'

export const getInfo = () => {
  const defaultObj = { token: '', userId: '' } // 默认值
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : defaultObj // 如果有数据就返回，没有数据，返回默认值
}

// 设置个人信息
export const setInfo = (info) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}

// 移除个人信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 获取搜索历史
export const getHistoryList = () => {
  const result = localStorage.getItem(HISTORY_KEY)
  return result ? JSON.parse(result) : [] // 如果有数据就返回，没有数据，返回空数组
}

// 设置搜索历史
export const setHistoryList = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}
