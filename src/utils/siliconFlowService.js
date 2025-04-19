import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建一个新的Axios实例用于硅基流动API
const siliconFlowService = axios.create({
  baseURL: 'https://api.siliconflow.cn/v1',
  timeout: 30000, // 增加超时时间到30秒
  headers: {
    'Content-Type': 'application/json'
  }
})

// API密钥 - 应该从环境变量或配置文件获取
// 注意: 在实际应用中，这个密钥不应该直接写在代码中
const API_KEY = 'sk-kawcqajfqchiodrrqlldnxdjciyuzngmibrveasmjxbxheja'

// 请求拦截器 - 添加API密钥
siliconFlowService.interceptors.request.use(
  config => {
    // 设置API密钥
    config.headers.Authorization = `Bearer ${API_KEY}`
    
    // 调试信息
    console.log('请求URL:', config.baseURL + config.url)
    console.log('请求方法:', config.method)
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {...config.params, _t: Date.now()}
    }
    
    // 不在控制台打印敏感信息
    const headers = {...config.headers}
    if (headers.Authorization) {
      headers.Authorization = 'Bearer ***' // 隐藏实际token
    }
    console.log('请求头:', JSON.stringify(headers))
    
    // 限制日志长度，避免图片base64数据淹没控制台
    if (config.data) {
      if (config.data.messages) {
        // 对于包含图片的请求，不打印完整内容
        console.log('请求数据: [包含图片或长消息，内容已省略]')
      } else {
        console.log('请求数据:', JSON.stringify(config.data).substring(0, 200) + '...')
      }
    }
    
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
siliconFlowService.interceptors.response.use(
  response => {
    // 调试信息
    console.log('API响应状态码:', response.status)
    // 限制日志长度，避免响应数据太长
    console.log('API响应数据:', JSON.stringify(response.data).substring(0, 200) + '...')
    return response.data
  },
  error => {
    ElMessage.closeAll()
    
    // 详细记录错误信息
    console.error('API请求失败:', error.message)
    
    if (error.response) {
      // 服务器返回错误
      const statusCode = error.response.status
      let errorMessage = '请求失败'
      
      console.error('HTTP状态码:', statusCode)
      console.error('响应头:', error.response.headers)
      
      if (error.config) {
        console.error('失败的请求配置:', {
          url: error.config.baseURL + error.config.url,
          method: error.config.method
        })
      }
      
      switch(statusCode) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = 'API密钥无效或已过期，请检查密钥设置'
          break
        case 403:
          errorMessage = '无权访问该资源，请确认账户权限'
          break
        case 404:
          errorMessage = '请求的API端点不存在，请检查URL'
          break
        case 429:
          errorMessage = '请求过于频繁，请稍后再试'
          break
        case 500:
          errorMessage = '服务器内部错误，请联系API提供方'
          break
        default:
          errorMessage = `请求失败 (${statusCode})`
      }
      
      try {
        if (error.response.data) {
          console.error('错误响应数据:', error.response.data)
          
          if (error.response.data.error) {
            const errorDetail = error.response.data.error.message || error.response.data.error
            errorMessage = `${errorMessage}: ${errorDetail}`
          }
        }
      } catch (e) {
        console.error('解析错误响应时出错:', e)
      }
      
      ElMessage.error(errorMessage)
    } else if (error.request) {
      // 发送了请求但未收到响应
      console.error('未收到响应:', error.request)
      ElMessage.error('网络异常，无法连接到服务器，请检查网络连接')
    } else {
      // 设置请求时出错
      ElMessage.error(`请求设置错误: ${error.message}`)
    }
    
    return Promise.reject(error)
  }
)

export default siliconFlowService 