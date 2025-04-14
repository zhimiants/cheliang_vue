import request from '@/utils/request'

//查询菜单列表
export const FindMenuList = ()=>{
    return request({
        url:`/admin/system/sysMenu/findMenuList`,
        method:"get"
    })
}


//添加菜单列表
export const AddMenu = (sysMenu)=>{
    return request({
        url:`/admin/system/sysMenu/addMenu`,
        method:"post",
        data:sysMenu
    })
}
//菜单删除
export const DeleteMenu = (menuId)=>{
    return request({
        url:`/admin/system/sysMenu/deleteMenu/${menuId}`,
        method:"delete",
    })
}
//修改菜单
export const UpdateMenu = (sysMenu)=>{
    return request({
        url:`/admin/system/sysMenu/update`,
        method:"put",
        data:sysMenu

    })
}
//为角色分配菜单
export const AssignMenuForRole = (assginMenuDto)=>{
    return request({
        url:`/admin/system/sysMenu/assignMenuForRole`,
        method:"post",
        data:assginMenuDto

    })
}
//根据角色Id回显已选菜单
export const FindMenuIdListByRoleId = (roleId)=>{
    return request({
        url:`/admin/system/sysMenu/findMenuIdListByRoleId/${roleId}`,
        method:'get'
    })
}