import request from '@/utils/request'

//后端的查询用户列表接口
export const FindByPage = (pageNum,pageSize,sysUserDto)=>{
    return request({
        url:`/admin/system/sysUser/findByPage/${pageNum}/${pageSize}`,
        method:'get',
        //post请求用data,get请求用params
        params:sysUserDto
      })
}

//后端的添加用户接口
export const AddSysUser = (sysUser)=>{
    return request({
        url:`/admin/system/sysUser/addUser`,
        method:'post',
        //post请求用data,get请求用params
        data:sysUser
      })
}
//后端的修改用户接口
export const UpdateSysUser = (sysUser)=>{
  return request({
      url:`/admin/system/sysUser/updateSysUser`,
      method:'put',
      //post请求用data,get请求用params
      data:sysUser
    })
}
//后端的删除用户接口
export const DeleteById = (id)=>{
  return request({
      url:`/admin/system/sysUser/deleteSysUser/${id}`,
      method:'delete',
      
    })
}
//后端的批量删除用户接口
export const DeleteByIds = (ids)=>{
  return request({
      url:`/admin/system/sysUser/deleteBatch`,
      method:'delete',
      data:ids
    })
}