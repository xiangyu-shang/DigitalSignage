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
    
    <!-- 调试信息弹窗 -->
    <div class="debug-panel" v-if="showDebugPanel">
      <div class="debug-header">
        <span class="debug-title">图片加载调试面板</span>
        <button class="debug-close" @click="showDebugPanel = false">×</button>
      </div>
      <div class="debug-content">
        <div class="debug-section">
          <h4>图片加载状态</h4>
          <div v-if="imageLoadReport">
            <p>总计: {{ imageLoadReport.total }} | 成功: {{ imageLoadReport.loaded }} | 失败: {{ imageLoadReport.failed }}</p>
          </div>
        </div>
        <div class="debug-section">
          <h4>问题诊断</h4>
          <button class="debug-btn" @click="openDebugTool">打开完整调试工具</button>
          <button class="debug-btn" @click="checkStaticFiles">检查静态文件</button>
          <button class="debug-btn" @click="reloadApp">重新加载应用</button>
        </div>
      </div>
    </div>
    
    <!-- 激活调试面板的按钮 -->
    <button class="debug-trigger" @click="toggleDebugPanel" v-if="isDevMode">
      调试
    </button>
  </div>
</template>

<script>
import { getImageLoadReport } from './assets/local-images';

export default {
  name: 'App',
  data() {
    return {
      appTitle: '数字标牌系统',
      isFullScreen: false,
      showTitleBar: false,
      mouseTimer: null,
      mouseY: 0,
      showDebugPanel: false,
      imageLoadReport: null,
      isDevMode: process.env.NODE_ENV !== 'production'
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
    
    // 调试相关方法
    toggleDebugPanel() {
      this.showDebugPanel = !this.showDebugPanel;
      if (this.showDebugPanel) {
        this.updateImageLoadReport();
      }
    },
    
    updateImageLoadReport() {
      this.imageLoadReport = getImageLoadReport();
    },
    
    openDebugTool() {
      window.open('/debug-image.html', '_blank');
    },
    
    checkStaticFiles() {
      // 尝试访问静态文件路径
      fetch('/images/temp/file_not_found.txt')
        .then(response => {
          if (response.ok) {
            alert('静态文件目录可以访问！');
          } else {
            alert(`静态文件目录访问失败: ${response.status} ${response.statusText}`);
          }
        })
        .catch(err => {
          alert(`静态文件访问错误: ${err.message}`);
        });
    },
    
    reloadApp() {
      window.location.reload();
    },
    
    // 注册全局错误处理器
    setupGlobalErrorHandlers() {
      // 监听资源加载错误
      window.addEventListener('error', (event) => {
        // 如果是图片加载错误
        if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'IMAGE')) {
          console.error(`[App] 图片加载错误: ${event.target.src}`);
          
          // 对于每10个错误，只记录并显示1次，避免大量相同错误信息
          if (Math.random() < 0.1) {
            console.warn(`[App] 检测到图片加载问题，可能的原因: 
              1. 图片文件可能不存在
              2. public/images/ 目录配置不正确
              3. 开发服务器没有正确处理静态资源
              请使用调试工具检查具体问题`);
          }
        }
      }, true);
    }
  },
  mounted() {
    // 初始状态为隐藏
    this.showTitleBar = false;
    
    // 设置全局错误处理器
    this.setupGlobalErrorHandlers();
    
    // 定期更新图片加载报告
    setInterval(() => {
      if (this.showDebugPanel) {
        this.updateImageLoadReport();
      }
    }, 5000);
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

/* 调试面板样式 */
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: white;
  z-index: 10000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.debug-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.debug-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.debug-content {
  padding: 12px;
}

.debug-section {
  margin-bottom: 10px;
}

.debug-section h4 {
  margin-bottom: 8px;
  color: #ccc;
}

.debug-btn {
  background-color: #444;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  margin-right: 8px;
  margin-bottom: 8px;
  color: white;
  cursor: pointer;
}

.debug-btn:hover {
  background-color: #555;
}

.debug-trigger {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  z-index: 9999;
}
</style> 