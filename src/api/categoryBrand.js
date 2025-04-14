import request from '@/utils/request'

const api_path = '/admin/system/categoryBrand'
export const FindByPage = (pageNum,pageSize,categoryBrandDto)=>{
    return request({
        url:`${api_path}/findByPage/${pageNum}/${pageSize}`,
        method:'post',
        data:categoryBrandDto
    })
}


export const AddBrandCategory = (categoryBrandDto)=>{
    return request({
        url:`${api_path}/addBrandCategory`,
        method:'post',
        data:categoryBrandDto
    })
}

export const GetIdList = (threeId)=>{
    return request({
        url:`${api_path}/getIdList/${threeId}`,
        method:'get',
    })
}

export const UpdateCategoryBrand = (categoryBrand)=>{
    return request({
        url:`${api_path}/updateCategoryBrand`,
        method:'post',
        data:categoryBrand
    })
}

export const DeleteById = (id)=>{
    return request({
        url:`${api_path}/deleteById/${id}`,
        method:'delete', 
    })
}

// 根据分类的id获取品牌数据
export const FindBrandByCategoryId = categoryId => {
    return request({
      url: `${api_path}/findBrandByCategoryId/${categoryId}`,
      method: 'get',
    })
}