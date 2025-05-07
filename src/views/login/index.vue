<!--登录页面-->
<template>
  <div class="login-container">
    <div class="login-background">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="car-animation">
        <svg class="car-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path d="M544 192h-16L419.22 56.02A64.025 64.025 0 0 0 369.24 32H155.33c-26.17 0-49.7 15.93-59.42 40.23L48 194.26C20.44 201.4 0 226.21 0 256v112c0 8.84 7.16 16 16 16h48c0 53.02 42.98 96 96 96s96-42.98 96-96h128c0 53.02 42.98 96 96 96s96-42.98 96-96h48c8.84 0 16-7.16 16-16v-80c0-53.02-42.98-96-96-96zM160 432c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48zm72-240H116.93l38.4-96H232v96zm48 0V96h89.24l76.8 96H280zm200 240c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48z"/>
        </svg>
      </div>
    </div>
    
    <div class="login-box">
      <div class="login-content">
        <h1 class="login-title">
          <span class="title-highlight">二手车</span>
          <span class="title-regular">管理系统</span>
        </h1>
        
        <div class="form-container">
          <el-form 
            class="login-form" 
            :model="model" 
            :rules="rules" 
            ref="loginForm"
            @keyup.enter="submit"
          >
            <el-form-item prop="userName">
              <el-input
                class="input-field"
                v-model="model.userName"
                prefix-icon="User"
                clearable
                :placeholder="$t('login.username')"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                class="input-field"
                v-model="model.password"
                prefix-icon="Lock"
                show-password
                clearable
                :placeholder="$t('login.password')"
              />
            </el-form-item>

            <el-form-item prop="captcha">
              <div class="captcha-container">
                <el-input
                  class="input-field captcha-input"
                  v-model="model.captcha"
                  prefix-icon="Picture"
                  placeholder="请输入验证码"
                ></el-input>
                <div class="captcha-image" @click="refreshCaptcha">
                  <img :src="captchaSrc" alt="验证码" />
                  <div class="refresh-overlay">
                    <el-icon><Refresh /></el-icon>
                  </div>
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                class="login-button"
                size="large"
                @click="submit"
              >
                <span>{{ btnText }}</span>
                <el-icon class="button-icon"><ArrowRight /></el-icon>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    
    <div class="change-lang">
      <change-lang />
    </div>
    
    <div class="login-footer">
      <p>© 2025 二手车管理系统 | 安全高效的车辆管理解决方案</p>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
  onMounted,
  watch,
} from 'vue'
import { Login, GetValidateCode } from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
import ChangeLang from '@/layout/components/Topbar/ChangeLang.vue'
import useLang from '@/i18n/useLang'
import { useApp } from '@/pinia/modules/app'
import { ArrowRight, Refresh } from '@element-plus/icons-vue'

export default defineComponent({
  components: { ChangeLang },
  name: 'login',
  setup() {
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this
    const router = useRouter()
    const route = useRoute()
    const { lang } = useLang()
    watch(lang, () => {
      state.rules = getRules()
    })
    const getRules = () => ({
      userName: [
        {
          required: true,
          message: ctx.$t('login.rules-username'),
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: ctx.$t('login.rules-password'),
          trigger: 'blur',
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t('login.rules-regpassword'),
          trigger: 'blur',
        },
      ],
      captcha: [
        {
          required: true,
          message: ctx.$t('login.rules-validate-code'),
          trigger: 'blur',
        },
      ],
    })

    // onMounted钩子函数
    onMounted(() => {
      state.refreshCaptcha()
      document.title = '登录 - 二手车管理系统'
    })

    const state = reactive({
      model: {
        userName: 'admin',
        password: '123456',
        captcha: '', // 用户输入的验证码
        codeKey: '', // 后端返回的验证码key
      },
      rules: getRules(),
      loading: false,
      captchaSrc: '',
      refreshCaptcha: async () => {
        try {
          const { data } = await GetValidateCode()
          state.model.codeKey = data.codeKey
          state.captchaSrc = data.codeValue
        } catch (error) {
          ctx.$message.error('获取验证码失败，请刷新页面重试')
        }
      },
      btnText: computed(() =>
        state.loading ? ctx.$t('login.logining') : ctx.$t('login.login')
      ),
      loginForm: ref(null),
      submit: () => {
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          if (valid) {
            state.loading = true
            try {
              const { code, data, message } = await Login(state.model)
              if (+code === 200) {
                ctx.$message.success({
                  message: ctx.$t('login.loginsuccess'),
                  duration: 1000,
                })

                const targetPath = decodeURIComponent(route.query.redirect || '/')
                if (targetPath.startsWith('http')) {
                  // 如果是一个url地址
                  window.location.href = targetPath
                } else if (targetPath.startsWith('/')) {
                  // 如果是内部路由地址
                  router.push(targetPath)
                } else {
                  router.push('/') // 请求成功以后，进入到首页
                }
                useApp().initToken(data)
              } else {
                ctx.$message.error(message)
              }
            } catch (error) {
              ctx.$message.error('登录失败，请检查网络连接或联系管理员')
            } finally {
              state.loading = false
            }
          }
        })
      },
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  overflow: hidden;
}

.login-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  .shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .shape1 {
    width: 600px;
    height: 600px;
    top: -150px;
    left: -120px;
    animation: float 15s ease-in-out infinite alternate;
  }
  
  .shape2 {
    width: 400px;
    height: 400px;
    bottom: -100px;
    right: -50px;
    animation: float 10s ease-in-out infinite alternate-reverse;
  }
  
  .car-animation {
    position: absolute;
    bottom: 50px;
    left: -100px;
    animation: driveCar 15s linear infinite;
    
    .car-icon {
      width: 100px;
      height: auto;
      fill: rgba(255, 255, 255, 0.05);
    }
  }
}

.login-box {
  position: relative;
  z-index: 10;
  width: 420px;
  max-width: 90%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.8s ease forwards;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #ff416c, #ff4b2b);
  }
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  position: relative;
  
  .title-highlight {
    color: #ff416c;
    font-weight: 700;
  }
  
  .title-regular {
    color: #333;
    font-weight: 400;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #ff416c, #ff4b2b);
    border-radius: 3px;
  }
}

.form-container {
  animation: slideUp 0.5s ease-out 0.3s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.login-form {
  width: 100%;
}

.input-field {
  height: 50px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    transform: translateY(-2px);
  }
  
  :deep(.el-input__wrapper) {
    border-radius: 8px !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
    background: white !important;
  }
  
  :deep(.el-input__inner) {
    color: #333 !important;
    
    &::placeholder {
      color: #aaa !important;
    }
  }
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  overflow: hidden;
  height: 48px;
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  img {
    height: 100%;
    display: block;
  }
  
  .refresh-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover {
    transform: scale(1.05);
    
    .refresh-overlay {
      opacity: 1;
    }
  }
}

.login-button {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  font-size: 18px;
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  border: none;
  transition: all 0.3s ease, transform 0.1s ease;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  position: relative;
  
  span {
    position: relative;
    z-index: 2;
  }
  
  .button-icon {
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #ff4b2b, #ff416c);
    transition: all 0.5s ease;
    z-index: 1;
  }
  
  &:hover {
    box-shadow: 0 5px 15px rgba(255, 65, 108, 0.4);
    
    &::before {
      left: 0;
    }
    
    .button-icon {
      transform: translateX(3px);
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.change-lang {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  
  :deep(.change-lang) {
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 18px;
    padding: 0 15px;
    color: white;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .icon {
      color: white;
    }
  }
}

.login-footer {
  position: absolute;
  bottom: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  text-align: center;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(20px, 20px) rotate(5deg);
  }
}

@keyframes driveCar {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .captcha-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .captcha-image {
    height: 40px;
  }
}
</style>
