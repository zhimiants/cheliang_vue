import siliconFlowService from '@/utils/siliconFlowService'

// Text conversation API
export function createTextConversation(messages) {
  return siliconFlowService({
    url: '/chat/completions',
    method: 'post',
    data: {
      model: 'Qwen/QwQ-32B',
      messages: messages,
      stream: false,
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      n: 1,
      response_format: {
        type: 'text'
      }
    }
  })
}

// Image generation API
export function generateImage(prompt) {
  return siliconFlowService({
    url: '/images/generations',
    method: 'post',
    data: {
      model: 'Kwai-Kolors/Kolors',
      prompt: prompt,
      image_size: '1024x1024',
      batch_size: 1,
      num_inference_steps: 20,
      guidance_scale: 7.5
    }
  })
}

/**
 * 图像识别API - 使用VLM多模态模型分析图片
 * @param {string} imageBase64 - 图片的base64编码或dataURL
 * @param {string} userPrompt - 用户提示文本
 * @returns {Promise<Object>} - API响应
 */
export function recognizeImage(imageBase64, userPrompt = '') {
  // 确保图片格式正确
  console.log('开始处理图片数据...')
  
  // 确保图片URL格式正确
  let imageUrl = imageBase64
  if (!imageBase64.startsWith('data:')) {
    console.log('添加dataURL前缀')
    imageUrl = `data:image/jpeg;base64,${imageBase64}`
  }
  
  // 默认提示文本
  const prompt = userPrompt || '请分析这张图片，这是什么车？告诉我详细信息。'
  console.log('用户提示:', prompt)
  
  // 构建请求体 - 严格按照API文档
  const requestBody = {
    model: 'Qwen/Qwen2.5-VL-72B-Instruct', // 使用官方支持的VLM模型
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: prompt 
          },
          { 
            type: 'image_url', 
            image_url: { 
              url: imageUrl,
              detail: 'auto' // 使用自动检测细节级别
            } 
          }
        ]
      }
    ],
    max_tokens: 1024,
    temperature: 0.7,
    top_p: 0.95,
    stream: false
  }
  
  console.log('使用模型:', requestBody.model)
  console.log('请求消息数量:', requestBody.messages.length)
  
  // 发送请求
  return siliconFlowService({
    url: '/chat/completions',
    method: 'post',
    data: requestBody
  })
}

// Get voice list
export function getVoiceList() {
  return siliconFlowService({
    url: '/audio/voice/list',
    method: 'get'
  })
}

// Text to speech
export function textToSpeech(text, voiceUri) {
  return siliconFlowService({
    url: '/audio/speech',
    method: 'post',
    data: {
      model: 'fishaudio/fish-speech-1.4',
      input: text,
      voice: voiceUri
    }
  })
} 