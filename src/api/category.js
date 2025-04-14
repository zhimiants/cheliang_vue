import request from '@/utils/request'


//公共路径
const api_path = '/admin/system/category'

//根据parentId查找下级分类
export const FindListByParentId = (parentId)=>{
    return request({
        url:`${api_path}/findListByParentId/${parentId}`,
        method:'get'
    })
}
//对应后端的下载按钮即导出
export const ExportCategoryData = ()=>{
    return request({
        url:`${api_path}/download`,
        method:'get',
        responseType:'blob' //新的点子:响应一个二进制流
    })
}
