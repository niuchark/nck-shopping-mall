import request from '@/utils/request'

export const getAddressList = () => {
  return request.get('/address/list')
}
