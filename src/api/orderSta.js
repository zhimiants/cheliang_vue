import request from '@/utils/request'

// 获取菜单
export const GetOrderSta = (params) => {
  return request({
    url: '/admin/system/orderSta/getOrderSta',
    method: 'get',
    params:params
  })
}
