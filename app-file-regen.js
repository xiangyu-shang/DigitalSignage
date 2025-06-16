/**
 * 重新生成App.vue文件，确保正确的编码格式
 */
const fs = require('fs');
const path = require('path');

// 新App.vue文件的内容
const appVueContent = `<template>
  <div class="app-container">
    <div class="title-bar" v-if="!isFullScreen">
      <div class="title">{{ appTitle }}</div>
      <div class="window-controls">
        <button class="control-btn minimize" @click="minimizeWindow">-</button>
        <button class="control-btn fullscreen" @click="toggleFullScreen">□</button>
        <button class="control-btn close" @click="closeWindow">x</button>
      </div>
    </div>
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appTitle: '数字标牌商品展示系统',
      isFullScreen: false
    }
  },
  methods: {
    minimizeWindow() {
      window.electronAPI.windowControl('minimize');
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
      window.electronAPI.windowControl('toggleFullScreen');
    },
    closeWindow() {
      window.electronAPI.windowControl('close');
    }
  },
  async mounted() {
    try {
      const version = await window.electronAPI.getAppVersion();
      console.log('应用版本: ' + version);
    } catch (error) {
      console.error('获取应用版本失败', error);
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.title-bar {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background-color: #333;
  color: white;
  -webkit-app-region: drag;
}

.title {
  font-size: 14px;
}

.window-controls {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
}

.control-btn {
  width: 24px;
  height: 24px;
  margin-left: 5px;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.control-btn.minimize:hover {
  background-color: #0078d7;
}

.control-btn.fullscreen:hover {
  background-color: #0078d7;
}

.control-btn.close:hover {
  background-color: #e81123;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
`;

// App.vue文件路径
const appVuePath = path.join(__dirname, 'src', 'renderer', 'App.vue');

// 备份原文件
function backupOriginalFile() {
  try {
    if (fs.existsSync(appVuePath)) {
      const backupPath = `${appVuePath}.old-${Date.now()}`;
      fs.copyFileSync(appVuePath, backupPath);
      console.log(`已备份原始文件到: ${backupPath}`);
      return true;
    } else {
      console.log('App.vue文件不存在，无需备份');
      return false;
    }
  } catch (error) {
    console.error('备份文件时出错:', error);
    return false;
  }
}

// 使用不同编码方式写入文件并测试
function generateAppVueWithDifferentEncodings() {
  try {
    // 1. 备份原文件
    backupOriginalFile();
    
    // 2. 生成不同版本的文件进行测试
    
    // 版本1: UTF-8（不带BOM）
    const utf8Path = `${appVuePath}`;
    fs.writeFileSync(utf8Path, appVueContent, { encoding: 'utf8' });
    console.log(`已生成UTF-8版本: ${utf8Path}`);
    
    console.log('完成！请尝试重新运行应用');
    
  } catch (error) {
    console.error('生成文件时出错:', error);
  }
}

// 执行重新生成
console.log('开始重新生成App.vue文件...');
generateAppVueWithDifferentEncodings(); 