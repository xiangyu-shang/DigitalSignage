<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo" @click="goHome">
        <img src="@/assets/images/logo.svg" alt="数字标牌商品展示系统" class="logo-image" />
        <h1 class="logo-text">数字商城</h1>
      </div>
      
      <div class="header-right">
        <!-- 购物车按钮 -->
        <cart-button />
        
        <!-- 设置按钮 -->
        <div class="settings-button" @click="toggleSettings">
          <i class="icon icon-settings"></i>
        </div>
      </div>
    </div>
    
    <!-- 设置面板 -->
    <div v-if="settingsOpen" class="settings-panel">
      <div class="settings-header">
        <h3>系统设置</h3>
        <button class="close-button" @click="toggleSettings">×</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-item">
          <span class="setting-label">水波纹效果</span>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="rippleEffectEnabled"
              @change="updateSettings"
            />
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">交互音效</span>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="soundEnabled"
              @change="updateSettings"
            />
            <span class="slider"></span>
          </label>
        </div>
        
        <div v-if="soundEnabled" class="setting-item">
          <span class="setting-label">音量</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            v-model.number="soundVolume"
            @change="updateSettings"
            class="volume-slider"
          />
          <span class="volume-value">{{ Math.round(soundVolume * 100) }}%</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { soundManager } from '@/utils/effects';
import CartButton from '@/components/common/CartButton.vue';

const router = useRouter();
const settingsStore = useSettingsStore();

// 设置面板状态
const settingsOpen = ref(false);

// 设置选项
const rippleEffectEnabled = computed({
  get: () => settingsStore.rippleEffectEnabled,
  set: (val) => settingsStore.updateSettings({ rippleEffectEnabled: val })
});

const soundEnabled = computed({
  get: () => settingsStore.soundEnabled,
  set: (val) => settingsStore.updateSettings({ soundEnabled: val })
});

const soundVolume = computed({
  get: () => settingsStore.soundVolume,
  set: (val) => settingsStore.updateSettings({ soundVolume: val })
});

// 导航到首页
function goHome() {
  // 播放点击音效
  soundManager.play('click');
  
  // 导航到首页
  router.push({ name: 'Menu' });
}

// 切换设置面板
function toggleSettings() {
  // 播放点击音效
  soundManager.play('click');
  
  // 切换设置面板显示状态
  settingsOpen.value = !settingsOpen.value;
}

// 更新设置
function updateSettings() {
  // 播放点击音效
  soundManager.play('click');
}
</script>

<style scoped>
.app-header {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-md);
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-image {
  width: 32px;
  height: 32px;
  margin-right: var(--spacing-sm);
}

.logo-text {
  font-size: var(--font-size-large);
  font-weight: 700;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.settings-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  margin-left: var(--spacing-md);
  cursor: pointer;
  transition: background-color 0.3s;
}

.settings-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.settings-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  color: var(--color-text);
  margin-top: 5px;
  overflow: hidden;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.settings-header h3 {
  margin: 0;
  font-size: var(--font-size-medium);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.settings-content {
  padding: var(--spacing-md);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.setting-label {
  font-size: var(--font-size-default);
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-secondary);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--color-secondary);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* 音量滑块样式 */
.volume-slider {
  flex: 1;
  margin-right: var(--spacing-sm);
}

.volume-value {
  width: 40px;
  text-align: right;
  font-size: var(--font-size-small);
}
</style> 