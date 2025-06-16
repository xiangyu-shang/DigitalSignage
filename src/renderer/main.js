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

// 错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误捕获:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
});

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
};

// 挂载应用
app.mount('#app');

// 应用图片监控，确保所有图片都能正确处理加载错误
monitorAllImages(); 