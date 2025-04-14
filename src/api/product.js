import request from '@/utils/request'

const api_name = '/admin/system/product'

// 分页列表
export const GetProductPageList = (pageNum, pageSize, queryDto) => {
  return request({
    url: `${api_name}/findByPage/${pageNum}/${pageSize}`,
    method: 'post',
    data: queryDto,
  })
}
 

// 添加信息
export const SaveProduct = product => {
  return request({
    url: `${api_name}/add`,
    method: 'post',
    data: product,
  })
}

// 修改信息
export const UpdateProductById = product => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: product,
  })
}

// 根据id获取信息
export const GetProductById = id => {
  return request({
    url: `${api_name}/getById/${id}`,
    method: 'get',
  })
}


// 根据id删除商品
export const DeleteProductById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete',
  })
}


//审核
export const UpdateProductAuditStatus = (id, auditStatus) => {
  return request({
    url: `${api_name}/updateAuditStatus/${id}/${auditStatus}`,
    method: 'get',
  })
}

//上下架
export const UpdateProductStatus = (id, status) => {
  return request({
    url: `${api_name}/updateStatus/${id}/${status}`,
    method: 'get',
  })
}


//查询所有的产品规格数据
export const FindAllProductSpec = () => {
  return request({
    url: `/admin/system/productSpec/findAll`,
    method: 'get',
  })
}