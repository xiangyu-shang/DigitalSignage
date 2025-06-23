<template>
  <div class="welcome-container" @click="goToMenu">
    <div class="welcome-content">
      <div class="brand-logo">
        <img 
          src="/images/main.jpg" 
          alt="咖啡展示" 
          class="splash-image" 
          @error="handleImageError"
          ref="splashImage"
        />
        <div v-if="imageLoadFailed" class="fallback-background"></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 欢迎页组件，作为应用的入口页面
 * 展示咖啡图片，点击任意位置进入菜单
 */
export default {
  name: 'WelcomeView',
  data() {
    return {
      imageLoadFailed: false,
      redirectTimer: null
    }
  },
  methods: {
    /**
     * 跳转到菜单页面
     */
    goToMenu() {
      this.$router.push('/menu');
    },
    
    /**
     * 处理图片加载错误
     * @param {Event} event - 错误事件对象
     */
    handleImageError(event) {
      console.error('图片加载失败:', event);
      this.imageLoadFailed = true;
      // 隐藏出错的图片元素
      if (this.$refs.splashImage) {
        this.$refs.splashImage.style.display = 'none';
      }
      
      // 尝试加载备选图片
      setTimeout(() => {
        if (this.$refs.splashImage) {
          this.$refs.splashImage.src = '/images/coffee1_main.jpg';
          this.$refs.splashImage.style.display = 'block';
        }
      }, 500);
    }
  },
  mounted() {
    // 设置定时器，如果用户没有点击，自动跳转到菜单页面
    this.redirectTimer = setTimeout(() => {
      if (this.$route.path === '/') {
        this.goToMenu();
      }
    }, 10000); // 10秒后自动跳转

    // 添加鼠标样式变化
    document.body.style.cursor = 'pointer';
  },
  beforeUnmount() {
    // 清除定时器
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
    // 恢复鼠标样式
    document.body.style.cursor = 'default';
  }
}
</script>

<style scoped>
.welcome-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  cursor: pointer;
}

.welcome-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.brand-logo {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.splash-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  animation: zoomUpEffect 15s ease-in-out infinite alternate;
  transform-origin: center 25%; /* 设置变换原点在图片上部区域 */
}

@keyframes zoomUpEffect {
  0% {
    transform: scale(1) translateY(0);
  }
  100% {
    transform: scale(1.1) translateY(-2%); /* 向上微移同时放大 */
  }
}

.fallback-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0066ff 0%, #001e4d 100%);
  z-index: 2;
}
</style> 