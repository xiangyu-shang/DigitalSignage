/**
 * @file main.js
 * @description 咖啡及饮品商品展示系统网页版入口文件
 */

// 设置控制台编码
console.log('应用启动，编码设置为UTF-8');

// 导入Vue核心
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 导入样式
import './assets/styles/main.css';

// 在导入部分添加我们的图片监控函数
import { monitorAllImages } from './assets/local-images';

// 初始化Pinia
const pinia = createPinia();

// 预先导入主题存储以确保主题在应用启动时立即应用
import { useThemeStore } from './stores/theme';

// 添加CSS变量监控，帮助调试主题问题
console.log('[main.js] 初始化CSS变量监控');

// 记录初始CSS变量状态
const root = document.documentElement;
console.log('[main.js] 初始CSS变量:', {
  primary: getComputedStyle(root).getPropertyValue('--color-primary'),
  background: getComputedStyle(root).getPropertyValue('--color-background')
});

// 创建一个MutationObserver来监视应用CSS变量的更改
const cssVarObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      console.log('[main.js] 检测到style属性变化');
      console.log('[main.js] 当前CSS变量:', {
        primary: getComputedStyle(root).getPropertyValue('--color-primary'),
        background: getComputedStyle(root).getPropertyValue('--color-background')
      });
    }
  });
});

// 配置观察器
cssVarObserver.observe(root, { attributes: true });

// 加载配置
let appConfig = {};
try {
  // 尝试从window全局变量中获取配置
  if (window.__APP_CONFIG__) {
    appConfig = window.__APP_CONFIG__;
    // 确保调试信息始终关闭
    if (appConfig.features) {
      appConfig.features.showDebugInfo = false;
      appConfig.features.enableAutoRefresh = false;
    }
  } else {
    // 默认配置
    appConfig = {
      display: {
        defaultTitle: '咖啡及饮品商品展示系统',
        refreshInterval: 60000,
        defaultLanguage: 'zh-CN'
      },
      features: {
        enableAutoRefresh: false,
        enableLogging: true,
        showDebugInfo: false
      }
    };
  }
} catch (e) {
  console.error('加载配置失败:', e);
}

// 错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误捕获:', event.error);
  logError('全局错误', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
  logError('Promise拒绝', event.reason);
});

// 简单的日志函数
function logError(type, error) {
  if (!appConfig.features?.enableLogging) return;
  
  try {
    const errorData = {
      type,
      message: error?.message || String(error),
      stack: error?.stack,
      time: new Date().toISOString()
    };
    
    // 记录到本地存储
    const logs = JSON.parse(localStorage.getItem('app_error_logs') || '[]');
    logs.push(errorData);
    // 只保留最近100条错误记录
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    localStorage.setItem('app_error_logs', JSON.stringify(logs));
  } catch (e) {
    console.error('记录错误日志失败:', e);
  }
}

// 创建Vue应用
const app = createApp(App);

// 使用插件
app.use(pinia);
app.use(router);

// 确保主题在应用启动时立即初始化
const themeStore = useThemeStore();

// 修复中文模板处理
app.config.compilerOptions = {
  whitespace: 'preserve',
  delimiters: ['${', '}'] // 使用不同的分隔符，避免中文处理问题
};

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误处理:', err, info);
  logError('Vue错误', { error: err, info });
};

// 设置页面标题
document.title = appConfig.display?.defaultTitle || '咖啡及饮品商品展示系统';

// 挂载应用
app.mount('#app');

// 应用图片监控，确保所有图片都能正确处理加载错误
monitorAllImages();