import request from '@/utils/request'

// 获取动态菜单
export const GetMenus = params => {
  return request({
    url: '/admin/system/sysMenu/menus',
    method: 'get',
    params,
  })
}
