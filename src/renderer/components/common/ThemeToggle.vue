<template>
  <div class="theme-toggle-container">
    <div class="toggle-label">
      <span class="label-text" :class="{ active: currentTheme === 'alternate' }">外送</span>
      
      <!-- 简化为原生按钮，使用类控制样式 -->
      <button 
        class="toggle-switch" 
        :class="{ 'is-checked': currentTheme === 'default' }"
        @click="toggleTheme">
        <div class="toggle-track">
          <div class="toggle-thumb"></div>
        </div>
      </button>
      
      <span class="label-text" :class="{ active: currentTheme === 'default' }">自提</span>
    </div>
    
    <!-- 调试状态显示 -->
    <div class="debug-info" v-if="debug">
      当前主题: {{ currentTheme }}
    </div>
  </div>
</template>

<script>
/**
 * 主题切换组件
 * 通过自提/外送的切换按钮来改变全局颜色方案
 */
import { ref, reactive, computed, onMounted } from 'vue';
import { useThemeStore } from '@/stores/theme';

export default {
  name: 'ThemeToggle',
  setup() {
    // 调试模式 - 默认开启
    const debug = ref(true);
    
    // 获取主题存储
    const themeStore = useThemeStore();
    console.log('ThemeToggle组件初始化');
    
    // 当前主题状态
    const currentTheme = ref(themeStore.currentThemeId);
    
    // 切换主题
    const toggleTheme = () => {
      console.log('主题切换按钮被点击');
      const newTheme = currentTheme.value === 'default' ? 'alternate' : 'default';
      console.log(`切换主题: ${currentTheme.value} -> ${newTheme}`);
      
      // 更新组件状态
      currentTheme.value = newTheme;
      
      // 通过store更新全局主题
      themeStore.setTheme(newTheme);
    };
    
    // 组件挂载时同步状态
    onMounted(() => {
      console.log('ThemeToggle组件已挂载，同步主题状态');
      currentTheme.value = themeStore.currentThemeId;
      
      // 三次点击任意位置可切换调试模式
      let clickCount = 0;
      let clickTimer = null;
      
      document.addEventListener('click', () => {
        clickCount++;
        
        if (clickTimer) clearTimeout(clickTimer);
        
        clickTimer = setTimeout(() => {
          if (clickCount >= 3) {
            debug.value = !debug.value;
            console.log('调试模式:', debug.value ? '开启' : '关闭');
          }
          clickCount = 0;
        }, 500);
      });
    });
    
    return {
      debug,
      currentTheme,
      toggleTheme
    };
  }
}
</script>

<style scoped>
.theme-toggle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: var(--spacing-md);
}

.toggle-label {
  display: flex;
  align-items: center;
  font-size: var(--font-size-small);
  color: white;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
}

.label-text {
  opacity: 0.7;
  transition: all 0.3s;
  font-weight: normal;
  margin: 0 var(--spacing-xs);
  white-space: nowrap;
}

.label-text.active {
  opacity: 1;
  font-weight: bold;
  color: var(--color-warning);
}

/* 使用原生按钮替换自定义复选框 */
.toggle-switch {
  display: block;
  width: 46px;
  height: 24px;
  margin: 0 var(--spacing-xs);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
}

.toggle-track {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  position: relative;
  transition: all 0.3s;
}

.toggle-thumb {
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 点击态样式 */
.toggle-switch.is-checked .toggle-track {
  background-color: var(--color-warning);
}

.toggle-switch.is-checked .toggle-thumb {
  transform: translateX(22px);
}

.toggle-track:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

/* 调试信息 */
.debug-info {
  margin-top: 4px;
  font-size: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 4px;
  border-radius: 4px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .label-text {
    font-size: calc(var(--font-size-small) * 0.9);
  }
  
  .toggle-switch {
    width: 40px;
    height: 22px;
  }
  
  .toggle-thumb.is-checked {
    transform: translateX(18px);
  }
}
</style> 