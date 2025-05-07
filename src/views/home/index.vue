<template>
  <div class="welcome-container">
    <div class="welcome-header">
      <div class="logo-animation">
        <svg class="car-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M5 9l2 -4h8l2 4" />
          <path d="M5 9h12v5a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3v-5z" />
          <path d="M15 9l-4 -4" />
        </svg>
      </div>
      <h1 class="system-title">二手车管理系统</h1>
    </div>

    <div class="welcome-main">
      <div class="welcome-text">
        <h2 class="welcome-heading">欢迎登录</h2>
        <p class="welcome-description">专业、高效的二手车管理解决方案</p>
        <p class="welcome-user-info">{{ userName }}，欢迎回来</p>
        <p class="last-login">上次登录：{{ lastLoginTime }}</p>
      </div>
    </div>

    <div class="welcome-footer">
      <p class="status-text">系统状态：<span class="status-active">运行中</span></p>
      <p class="copyright">© 2025 二手车管理系统 | 安全高效的车辆管理解决方案</p>
    </div>

    <div class="background-decoration">
      <div class="decoration-circle circle1"></div>
      <div class="decoration-circle circle2"></div>
      <div class="decoration-circle circle3"></div>
      <div class="car-silhouette car-silhouette-1"></div>
      <div class="car-silhouette car-silhouette-2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 获取当前用户名称
const userName = ref('管理员')

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取上次登录时间
const lastLoginTime = ref(formatDate(new Date()))

// 页面加载动画
onMounted(() => {
  // 这里可以添加页面加载时的动画逻辑
})
</script>

<style lang="scss" scoped>
.welcome-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  overflow: hidden;
}

.welcome-header {
  display: flex;
  align-items: center;
  padding: 2rem 4rem;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
    justify-content: center;
  }
}

.logo-animation {
  animation: bounce 2s ease infinite;
  margin-right: 1rem;
}

.car-icon {
  color: #3a7bd5;
}

.system-title {
  font-size: 2.2rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(90deg, #3a7bd5, #3a6073);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
}

.welcome-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 4rem;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
}

.welcome-text {
  max-width: 800px;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: fadeInUp 1s ease-out;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
}

.welcome-heading {
  font-size: 3.5rem;
  color: #3a7bd5;
  margin: 0 0 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
}

.welcome-description {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
}

.welcome-user-info {
  font-size: 1.2rem;
  color: #2d3748;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.last-login {
  color: #718096;
  font-size: 0.9rem;
}

.welcome-footer {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 4rem;
  background: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}

.status-text {
  margin: 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.status-active {
  color: #2ecc71;
  font-weight: bold;
}

.copyright {
  margin: 0;
  font-size: 0.9rem;
  color: #718096;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(58, 123, 213, 0.1);
}

.circle1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
}

.circle2 {
  width: 600px;
  height: 600px;
  bottom: -200px;
  right: -200px;
  background: rgba(58, 123, 213, 0.05);
}

.circle3 {
  width: 300px;
  height: 300px;
  top: 20%;
  right: 10%;
  background: rgba(58, 123, 213, 0.07);
}

.car-silhouette {
  position: absolute;
  width: 240px;
  height: 100px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M544 192h-16L419.22 56.02A64.025 64.025 0 0 0 369.24 32H155.33c-26.17 0-49.7 15.93-59.42 40.23L48 194.26C20.44 201.4 0 226.21 0 256v112c0 8.84 7.16 16 16 16h48c0 53.02 42.98 96 96 96s96-42.98 96-96h128c0 53.02 42.98 96 96 96s96-42.98 96-96h48c8.84 0 16-7.16 16-16v-80c0-53.02-42.98-96-96-96zM160 432c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48zm72-240H116.93l38.4-96H232v96zm48 0V96h89.24l76.8 96H280zm200 240c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48z"/></svg>');
  background-repeat: no-repeat;
  opacity: 0.05;
}

.car-silhouette-1 {
  bottom: 15%;
  left: 5%;
  animation: carMove1 30s linear infinite;
}

.car-silhouette-2 {
  top: 30%;
  right: 5%;
  transform: scaleX(-1);
  animation: carMove2 25s linear infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-8px);}
  60% {transform: translateY(-4px);}
}

@keyframes carMove1 {
  0% {transform: translateX(-50px);}
  50% {transform: translateX(50px);}
  100% {transform: translateX(-50px);}
}

@keyframes carMove2 {
  0% {transform: translateX(50px) scaleX(-1);}
  50% {transform: translateX(-50px) scaleX(-1);}
  100% {transform: translateX(50px) scaleX(-1);}
}
</style>

