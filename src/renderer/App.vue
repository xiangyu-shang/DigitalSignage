<template>
  <div class="app-container" @mousemove="handleMouseMove">
    <div class="title-bar" v-if="!isFullScreen" :class="{ hidden: !showTitleBar }">
      <div class="title">{{ appTitle }}</div>
      <div class="window-controls">
        <button class="control-btn minimize" @click="minimizeWindow">-</button>
        <button class="control-btn fullscreen" @click="toggleFullScreen">□</button>
        <button class="control-btn close" @click="closeWindow">x</button>
      </div>
    </div>
    
    <div class="mobile-container">
    <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      appTitle: 'Digital Signage System',
      isFullScreen: false,
      showTitleBar: false,
      mouseTimer: null,
      mouseY: 0
    }
  },
  methods: {
    minimizeWindow() {
      window.electronAPI && window.electronAPI.windowControl('minimize');
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
      window.electronAPI && window.electronAPI.windowControl('toggleFullScreen');
    },
    closeWindow() {
      window.electronAPI && window.electronAPI.windowControl('close');
    },
    handleMouseMove(event) {
      // 获取鼠标Y坐标
      this.mouseY = event.clientY;
      
      // 当鼠标在顶部10px区域内时显示标题栏
      if (this.mouseY <= 10) {
        this.showTitleBar = true;
      } else if (this.mouseY > 40) {
        // 当鼠标离开标题栏区域一段距离后隐藏标题栏
        this.showTitleBar = false;
      }
      
      // 清除之前的定时器
      if (this.mouseTimer) {
        clearTimeout(this.mouseTimer);
      }
      
      // 如果标题栏显示，设置一个定时器在3秒后自动隐藏
      if (this.showTitleBar && this.mouseY > 10) {
        this.mouseTimer = setTimeout(() => {
          this.showTitleBar = false;
        }, 3000);
      }
    },
    
    // 注册全局错误处理器
    setupGlobalErrorHandlers() {
      // 监听资源加载错误
      window.addEventListener('error', (event) => {
        // 如果是图片加载错误
        if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'IMAGE')) {
          console.error(`[App] Image loading error: ${event.target.src}`);
        }
      }, true);
    }
  },
  mounted() {
    // 初始状态为隐藏
    this.showTitleBar = false;
    
    // 设置全局错误处理器
    this.setupGlobalErrorHandlers();
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  overflow: hidden;
}

.mobile-container {
  width: 100%;
  height: 100%;
  max-width: calc(9/16 * 100vh);
  max-height: 100vh;
  background-color: white;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 calc(20 * var(--vw-unit)) rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}

/* 在宽屏设备上居中显示 */
@media (min-width: 769px) {
  .mobile-container {
    width: calc(9/16 * 100vh);
  }
}

/* 在移动设备上全屏显示 */
@media (max-width: 768px) {
  .mobile-container {
    width: 100%;
    height: 100%;
    max-width: 100%;
    box-shadow: none;
  }
}

.title-bar {
  height: calc(32 * var(--vw-unit));
  background-color: #333;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 calc(10 * var(--vw-unit));
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.title-bar.hidden {
  transform: translateY(calc(-32 * var(--vw-unit)));
  opacity: 0;
}

.window-controls {
  display: flex;
  -webkit-app-region: no-drag;
}

.control-btn {
  width: calc(24 * var(--vw-unit));
  height: calc(24 * var(--vw-unit));
  background: none;
  border: none;
  color: white;
  margin-left: calc(5 * var(--vw-unit));
  cursor: pointer;
}
</style> 