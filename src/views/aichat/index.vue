<template>
  <div class="ai-chat-container">
    <!-- Header with Apple-style design -->
    <div class="ai-header">
      <div class="ai-header-title">
        <svg class="car-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 13l2-8h10l2 8m0 0H5m14 0 1 3H4l1-3m10 3v2H9v-2" />
        </svg>
        <h1>AI 汽车助手</h1>
      </div>
      <div class="ai-header-actions">
        <el-button
          type="primary"
          circle
          @click="newChat"
        >
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Chat content area -->
    <div class="chat-area" ref="chatAreaRef">
      <div v-if="messages.length === 0" class="welcome-screen">
        <div class="welcome-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M5 13l2-8h10l2 8m0 0H5m14 0 1 3H4l1-3m10 3v2H9v-2" />
          </svg>
        </div>
        <h2>欢迎使用 AI 汽车助手</h2>
        <p>我可以帮您了解各种汽车信息，回答汽车相关问题，甚至可以识别车型和生成汽车图片</p>
        <div class="suggestion-chips">
          <div class="suggestion-chip" @click="setPrompt('介绍一下最新的电动汽车技术')">
            介绍一下最新的电动汽车技术
          </div>
          <div class="suggestion-chip" @click="setPrompt('帮我生成一张红色跑车的图片')">
            帮我生成一张红色跑车的图片
          </div>
          <div class="suggestion-chip" @click="setPrompt('汽车保养有哪些注意事项？')">
            汽车保养有哪些注意事项？
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-else class="messages-container">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']"
        >
          <div class="message-avatar">
            <el-avatar>
              <el-icon v-if="message.role === 'user'"><User /></el-icon>
              <el-icon v-else><Service /></el-icon>
            </el-avatar>
          </div>
          <div class="message-content">
            <!-- Text content -->
            <div v-if="message.content && typeof message.content === 'string'" class="message-text" v-html="formatMessageText(message.content)"></div>
            
            <!-- Array content (for multimodal) -->
            <template v-else-if="Array.isArray(message.content)">
              <div v-for="(item, i) in message.content" :key="i">
                <!-- Text content -->
                <div v-if="item.type === 'text'" class="message-text" v-html="formatMessageText(item.text)"></div>
                
                <!-- Image content -->
                <div v-else-if="item.type === 'image_url'" class="message-image">
                  <el-image 
                    :src="item.image_url.url" 
                    :preview-src-list="[item.image_url.url]"
                    fit="cover"
                    class="image-preview"
                  ></el-image>
                </div>
              </div>
            </template>

            <!-- Generated images -->
            <div v-if="message.generatedImages && message.generatedImages.length > 0" class="generated-images">
              <el-image
                v-for="(img, imgIndex) in message.generatedImages"
                :key="imgIndex"
                :src="img"
                :preview-src-list="message.generatedImages"
                fit="cover"
                class="image-preview"
              ></el-image>
            </div>

            <!-- Audio playback -->
            <div v-if="message.audioUrl" class="audio-container">
              <audio controls :src="message.audioUrl" class="audio-player"></audio>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="loading-indicator">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="input-area">
      <label for="file-upload" class="file-upload-button">
        <el-tooltip content="上传图片" placement="top">
          <el-icon><Picture /></el-icon>
        </el-tooltip>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        @change="handleFileUpload"
        style="display: none"
      />
      
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="1"
        placeholder="输入消息，询问汽车相关问题，或要求生成图片..."
        resize="none"
        @keydown.enter.prevent="sendMessage"
      ></el-input>
      
      <el-button
        type="primary"
        circle
        @click="sendMessage"
        :disabled="!inputMessage.trim() && !selectedImage"
      >
        <el-icon><Position /></el-icon>
      </el-button>
    </div>

    <!-- Image preview modal -->
    <el-dialog v-model="imagePreviewVisible" title="图片预览与设置" width="500px">
      <div class="image-preview-container">
        <img :src="selectedImageUrl" class="preview-image" />
        <el-input
          v-model="imagePrompt"
          type="textarea"
          :rows="2"
          placeholder="请输入您对图片的问题，例如：这是什么品牌的车？它的性能如何？"
          resize="none"
          class="image-prompt-input"
        ></el-input>
        
        <div class="compression-settings">
          <div class="setting-title">图片压缩质量</div>
          <el-slider
            v-model="imageCompressionQuality"
            :min="0.4"
            :max="1"
            :step="0.1"
            :format-tooltip="val => Math.round(val * 100) + '%'"
          ></el-slider>
          <div class="setting-description">
            <span>较低质量 (更小体积)</span>
            <span>高质量 (较大体积)</span>
          </div>
          <div class="setting-tip">
            <el-alert
              type="info"
              show-icon
              :closable="false"
            >
              <template #title>
                <span>提示：如果图像识别失败，请尝试降低图片质量或选择更小的图片</span>
              </template>
            </el-alert>
          </div>
        </div>
        
        <div class="preview-actions">
          <el-button type="danger" @click="cancelImageUpload">取消</el-button>
          <el-button type="primary" @click="sendImageForAnalysis" :loading="isCompressing">{{ isCompressing ? '正在压缩...' : '发送图片' }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Plus, User, Service, Position } from '@element-plus/icons-vue'
import { createTextConversation, generateImage, recognizeImage, getVoiceList, textToSpeech } from '@/api/siliconflow'
import { marked } from 'marked'
import hljs from 'highlight.js'

// Configure marked to use highlight.js for code syntax highlighting
marked.use({
  renderer: {
    code(code, language) {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return `<pre><code class="hljs language-${validLanguage}">${
        hljs.highlight(code, { language: validLanguage, ignoreIllegals: true }).value
      }</code></pre>`;
    }
  },
  breaks: true,
  gfm: true
});

// State variables
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const chatAreaRef = ref(null)
const selectedImage = ref(null)
const imagePreviewVisible = ref(false)
const selectedImageUrl = ref('')
const voiceList = ref([])
const imagePrompt = ref('请分析这张图片，这是什么车？')
const imageCompressionQuality = ref(0.8)
const isCompressing = ref(false)

// Lifecycle hooks
onMounted(async () => {
  try {
    const response = await getVoiceList()
    console.log('语音列表响应:', response)
    
    if (response && response.results) {
      voiceList.value = response.results
      console.log('获取到的语音列表:', voiceList.value)
    } else {
      console.warn('未获取到语音列表或格式不正确')
    }
    
    // 添加初始欢迎消息
    messages.value.push({
      role: 'assistant',
      content: '您好！我是AI汽车助手，很高兴为您服务。您可以询问我汽车相关的问题，或者要求我生成汽车图片。\n\n如果遇到接口问题，请告知管理员检查API配置。'
    })
  } catch (error) {
    console.error('获取语音列表失败:', error)
    
    // 即使获取语音列表失败，也添加欢迎消息
    messages.value.push({
      role: 'assistant',
      content: '您好！我是AI汽车助手，很高兴为您服务。您可以询问我汽车相关的问题，或者要求我生成汽车图片。\n\n注意：语音服务暂时不可用。'
    })
  }
})

// Helper functions
const scrollToBottom = async () => {
  await nextTick()
  if (chatAreaRef.value) {
    chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
  }
}

const formatMessageText = (text) => {
  return marked(text)
}

const setPrompt = (prompt) => {
  inputMessage.value = prompt
}

const newChat = () => {
  messages.value = []
  inputMessage.value = ''
  selectedImage.value = null
}

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查文件大小
    const fileSizeMB = file.size / (1024 * 1024)
    console.log('上传图片大小:', fileSizeMB.toFixed(2), 'MB')
    
    // 如果文件太大，给出提示
    if (fileSizeMB > 5) {
      ElMessage.warning(`图片较大(${fileSizeMB.toFixed(2)}MB)，可能会影响上传速度和识别质量`)
    }
    
    selectedImage.value = file
    selectedImageUrl.value = URL.createObjectURL(file)
    imagePreviewVisible.value = true
  }
}

const cancelImageUpload = () => {
  selectedImage.value = null
  selectedImageUrl.value = ''
  imagePreviewVisible.value = false
  // Reset file input
  document.getElementById('file-upload').value = ''
}

// Send image for analysis
const sendImageForAnalysis = async () => {
  if (!selectedImage.value) return
  
  try {
    isCompressing.value = true
    imagePreviewVisible.value = false
    isLoading.value = true
    
    // 获取文件类型
    const fileType = selectedImage.value.type || 'image/jpeg'
    console.log('图片文件类型:', fileType)
    
    // 检查文件大小
    const fileSizeMB = selectedImage.value.size / (1024 * 1024)
    if (fileSizeMB > 10) {
      ElMessage.error(`图片太大 (${fileSizeMB.toFixed(2)}MB)，请选择小于10MB的图片`)
      isLoading.value = false
      isCompressing.value = false
      return
    }
    
    // Add user message with image - 先添加预览图片到界面
    try {
      // 直接读取图片为base64，暂时不进行压缩
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        const imageDataUrl = e.target.result
        console.log('图片已加载为DataURL')
        isCompressing.value = false
        
        // 用户输入的提示文本
        const userPrompt = imagePrompt.value.trim() || '请分析这张图片，这是什么车？'
        
        // 添加用户消息和图片到聊天界面
        messages.value.push({
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: imageDataUrl } }
          ]
        })
        
        await scrollToBottom()
        
        // 显示处理中状态
        ElMessage.info('正在分析图片，请稍候...')
        
        // 调用API进行图像识别
        console.log('正在发送图像识别请求...')
        try {
          const response = await recognizeImage(imageDataUrl, userPrompt)
          console.log('图像识别响应成功')
          
          // 检查响应格式
          if (response.choices && response.choices[0] && response.choices[0].message) {
            // 添加助手回复
            messages.value.push({
              role: 'assistant',
              content: response.choices[0].message.content
            })
            ElMessage.success('图像识别成功')
          } else {
            console.error('意外的图像识别API响应格式:', response)
            ElMessage.warning('收到了非标准格式的响应')
            messages.value.push({
              role: 'assistant',
              content: '抱歉，我无法正确识别这张图片。收到了非标准格式的响应。'
            })
          }
        } catch (apiError) {
          console.error('API调用错误:', apiError)
          ElMessage.error(`图像识别失败: ${apiError.message || '未知错误'}`)
          messages.value.push({
            role: 'assistant',
            content: '抱歉，图像识别服务暂时不可用。可能原因：\n\n1. API密钥可能无效或过期\n2. 图片格式不被支持\n3. 服务器暂时不可用\n\n请联系管理员检查API配置。'
          })
        }
        
        // 清理
        selectedImage.value = null
        imagePrompt.value = '请分析这张图片，这是什么车？' // 重置为默认值
        document.getElementById('file-upload').value = ''
        isLoading.value = false
        await scrollToBottom()
      }
      
      reader.onerror = (error) => {
        console.error('读取文件失败:', error)
        ElMessage.error('读取图片文件失败')
        isLoading.value = false
        isCompressing.value = false
      }
      
      reader.readAsDataURL(selectedImage.value)
    } catch (error) {
      console.error('图像处理错误:', error)
      ElMessage.error('图片处理失败，请重试')
      messages.value.push({
        role: 'assistant',
        content: '抱歉，图片处理失败，请重试。'
      })
      isLoading.value = false
      isCompressing.value = false
    }
  } catch (error) {
    console.error('图像识别过程错误:', error)
    ElMessage.error('图片处理失败，请重试')
    messages.value.push({
      role: 'assistant',
      content: '抱歉，图片处理失败，请重试。'
    })
    isLoading.value = false
    isCompressing.value = false
  }
}

// Send text message
const sendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message) return

  try {
    isLoading.value = true
    
    // Add user message
    messages.value.push({
      role: 'user',
      content: message
    })
    
    inputMessage.value = ''
    await scrollToBottom()
    
    // Check if it's an image generation request
    if (message.includes('生成') && (message.includes('图片') || message.includes('图像'))) {
      await handleImageGeneration(message)
    } else if (message.includes('语音') || message.includes('朗读') || message.includes('说')) {
      await handleTextToSpeech(message)
    } else {
      // Regular conversation
      await handleTextConversation(message)
    }
  } catch (error) {
    console.error('Error sending message:', error)
    ElMessage.error('消息发送失败，请重试')
    messages.value.push({
      role: 'assistant',
      content: '抱歉，发生了错误，请重试。'
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// Handle text conversation
const handleTextConversation = async (message) => {
  // Format messages for API
  const apiMessages = messages.value
    .filter(msg => typeof msg.content === 'string')
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  
  console.log('准备发送文本对话请求，消息:', apiMessages)

  try {
    console.log('发送文本对话请求...')
    const response = await createTextConversation(apiMessages)
    console.log('文本对话响应:', response)
    
    // 检查响应格式
    if (response.choices && response.choices[0] && response.choices[0].message) {
      // 添加助手回复
      messages.value.push({
        role: 'assistant',
        content: response.choices[0].message.content
      })
    } else {
      console.error('意外的API响应格式:', response)
      ElMessage.error('响应格式错误，请联系管理员')
      messages.value.push({
        role: 'assistant',
        content: '抱歉，我遇到了问题，无法正确处理您的请求。'
      })
    }
  } catch (error) {
    console.error('对话请求错误:', error)
    
    // 显示更详细的错误信息
    if (error.response && error.response.status) {
      ElMessage.error(`对话请求失败 (${error.response.status}): 请检查API配置`)
    } else {
      ElMessage.error('对话请求失败: ' + (error.message || '未知错误'))
    }
    
    messages.value.push({
      role: 'assistant',
      content: '抱歉，我无法处理您的请求。请检查网络连接或API密钥配置。'
    })
  }
}

// Handle image generation
const handleImageGeneration = async (message) => {
  // Extract prompt for image generation
  let prompt = message
  if (message.includes('生成')) {
    prompt = message.split('生成')[1].trim()
    if (prompt.startsWith('一张')) {
      prompt = prompt.substring(2).trim()
    }
    if (prompt.includes('图片')) {
      prompt = prompt.replace('图片', '').trim()
    }
    if (prompt.includes('图像')) {
      prompt = prompt.replace('图像', '').trim()
    }
  }
  
  console.log('图像生成提示语:', prompt)
  
  try {
    console.log('发送图像生成请求...')
    const response = await generateImage(prompt)
    console.log('图像生成响应:', response)
    
    // 检查响应格式
    if (response.images && response.images.length > 0 && response.images[0].url) {
      console.log('图像URL:', response.images[0].url)
      // 添加助手回复与生成的图片
      messages.value.push({
        role: 'assistant',
        content: `我已经根据您的要求生成了图片: "${prompt}"`,
        generatedImages: [response.images[0].url]
      })
    } else {
      console.error('意外的图像生成API响应格式:', response)
      ElMessage.error('图像生成响应格式错误，请联系管理员')
      messages.value.push({
        role: 'assistant',
        content: '抱歉，我无法生成图像。请稍后再试。'
      })
    }
  } catch (error) {
    console.error('图像生成错误:', error)
    
    // 显示更详细的错误信息
    if (error.response && error.response.status) {
      ElMessage.error(`图像生成失败 (${error.response.status}): 请检查API配置`)
    } else {
      ElMessage.error('图像生成失败: ' + (error.message || '未知错误'))
    }
    
    messages.value.push({
      role: 'assistant',
      content: '抱歉，图像生成服务暂时不可用。请检查API密钥或稍后再试。'
    })
  }
}

// Handle text to speech
const handleTextToSpeech = async (message) => {
  if (voiceList.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，没有可用的语音模型。'
    })
    return
  }
  
  // Extract text for speech
  let textForSpeech = message
  if (message.includes('朗读') || message.includes('语音') || message.includes('说')) {
    const parts = message.split(/朗读|语音|说/)
    if (parts.length > 1) {
      textForSpeech = parts[1].trim()
    }
  }
  
  // Use the first available voice
  const voice = voiceList.value[0].uri
  
  const response = await textToSpeech(textForSpeech, voice)
  
  // Add assistant response with audio
  messages.value.push({
    role: 'assistant',
    content: `我已经将文本转换为语音: "${textForSpeech}"`,
    audioUrl: response.url
  })
}
</script>

<style scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f7;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.ai-header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.car-icon {
  color: #0066cc;
}

.ai-header-title h1 {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  scroll-behavior: smooth;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
}

.welcome-icon {
  background-color: #f2f2f7;
  padding: 24px;
  border-radius: 50%;
  margin-bottom: 24px;
  color: #0066cc;
}

.welcome-screen h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1d1d1f;
}

.welcome-screen p {
  font-size: 16px;
  color: #86868b;
  line-height: 1.6;
  margin-bottom: 32px;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.suggestion-chip {
  background-color: white;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  color: #0066cc;
}

.suggestion-chip:hover {
  background-color: #f2f2f7;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.messages-container {
  max-width: 900px;
  margin: 0 auto;
}

.message {
  display: flex;
  margin-bottom: 24px;
  gap: 16px;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 80%;
}

.user-message .message-content {
  background-color: #0066cc;
  color: white;
}

.assistant-message .message-content {
  background-color: white;
  color: #1d1d1f;
}

.message-text {
  line-height: 1.6;
}

.user-message .message-text {
  color: white;
}

.message-text pre {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
  margin: 16px 0;
}

.user-message .message-text pre {
  background-color: rgba(255, 255, 255, 0.1);
}

.message-image {
  margin-top: 12px;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  cursor: pointer;
}

.generated-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.audio-container {
  margin-top: 16px;
}

.audio-player {
  width: 100%;
  border-radius: 20px;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #0066cc;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.6;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.input-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid #e0e0e0;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.file-upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f2f2f7;
  color: #0066cc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-button:hover {
  background-color: #e5e5ea;
}

.image-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.preview-actions {
  display: flex;
  gap: 12px;
}

.image-prompt-input {
  margin: 16px 0;
  width: 100%;
}

.compression-settings {
  margin-bottom: 16px;
}

.setting-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
}

.setting-description {
  font-size: 12px;
  color: #86868b;
}

.setting-tip {
  margin-top: 8px;
}

/* Element Plus overrides */
:deep(.el-textarea__inner) {
  border-radius: 20px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  resize: none;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

:deep(.el-button.is-circle) {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-button--primary) {
  background-color: #0066cc;
}

:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 16px 24px;
  margin: 0;
  border-bottom: 1px solid #e0e0e0;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__headerbtn) {
  top: 16px;
  right: 16px;
}
</style>
  