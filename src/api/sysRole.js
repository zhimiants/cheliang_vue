import request from '@/utils/request'

//定义js方法发送请求,调用后端控制器方法

export const FindByPage = (pageNum,pageSize,searchObj)=>{
    return request({
        url:`/admin/system/sysRole/findByPage/${pageNum}/${pageSize}`,
        method:'post',
        data:searchObj
      })
}

//添加角色
export const AddRole = (sysRole)=>{
  return request({
    url:`/admin/system/sysRole/addRole`,
    method:'post',
    data:sysRole
  })
}


//更新角色
export const UpdateRole = (sysRole)=>{
  return request({
    url:`/admin/system/sysRole/updateRole`,
    method:'put',
    data:sysRole
  })
}

//对应后端的删除角色
export const DeleteRole = (roleId)=>{
  return request({
    url:`/admin/system/sysRole/deleteRole/${roleId}`,
    method:'delete',
    
  })
}

//对应后端的查询未删除角色列表
export const FindRoleList = ()=>{
  return request({
    url:`/admin/system/sysRole/findRoleList`,
    method:'get',
    
  })
}
//对应后端的根据用户id查询角色id集合
export const FindRoleIdListByUserId = (userId)=>{
  return request({
    url:`/admin/system/sysRole/getRoleListByUserId/${userId}`,
    method:'get'
   
  })
}
//对应后端合并两个接口 查询所有角色列表和根据用户id查询对应角色集合
export const GetRoleListAndRoleIdList = (userId)=>{
  return request({
    url:`/admin/system/sysRole/getRoleListAndRoleIdList/${userId}`,
    method:'get'
   
  })
}
//对应后端给用户分配角色
export const DoAssign = (data)=>{
  return request({
    url:`/admin/system/sysRole/doAssign`,
    method:'post',
    data
  })
}