import request from '@/utils/request'

//设置公共路径
const api_path = '/admin/system/brand'

//对应后端的分页查询
export const FindByPage = (pageNum,pageSize)=>{
    return request({
        url:`${api_path}/findByPage/${pageNum}/${pageSize}`,
        method:'get'
    })
}
//对应后端添加品牌
export const AddBrand = (brand)=>{
    return request({
        url:`${api_path}/addBrand`,
        method:"post",
        data:brand
    })
}
//对应后端修改品牌
export const UpdateBrand = (brand)=>{
    return request({
        url:`${api_path}/updateBrand`,
        method:'post',
        data:brand
    })
}

//对应后端的删除品牌
export const DeleteBrand = (id)=>{
    return request({
        url:`${api_path}/deleteBrand/${id}`,
        method:'delete',
    })
}

//对应分类品牌的查询功能
export const FindAll = ()=>{
    return request({
        url:`${api_path}/findAll`,
        method:'get'
    })
}