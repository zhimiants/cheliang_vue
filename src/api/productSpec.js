import request from '@/utils/request'

const api_path = '/admin/system/productSpec'
export const FindByPage = (pageNum,pageSize)=>{
    return request({
        url:`${api_path}/findByPage/${pageNum}/${pageSize}`,
        method:'get'
    })
}  

export const AddProductSpec = (productSpec)=>{
    return request({
        url:`${api_path}/add`,
        method:'post',
        data:productSpec
    })
}

export const UpdateProductSpec = (productSpec)=>{
    return request({
        url:`${api_path}/update`,
        method:'put',
        data:productSpec
    })
}
export const DeleteProductSpec = (id)=>{
    
    return request({
        url:`${api_path}/deleteById/${id}`,
        method:'delete',
    })
}
// //查询所有的产品规格数据
// export const FindAllProductSpec = () => {
//     return request({
//       url: `${api_name}/findAll`,
//       method: 'get',
//     })
// }