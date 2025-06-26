/**
 * @file main-web.js
 * @description 咖啡及饮品商品展示系统网页版入口文件
 */

// 导入Vue核心
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 导入样式
import './assets/styles/main.css';

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
const pinia = createPinia();
const app = createApp(App);

// 使用插件
app.use(pinia);
app.use(router);

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