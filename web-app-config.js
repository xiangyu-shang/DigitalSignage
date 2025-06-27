/**
 * @file web-app-config.js
 * @description 网页应用配置，用于将Electron应用转换为纯网页应用
 */

// 导出配置
module.exports = {
  // 应用信息
  appInfo: {
    name: '咖啡及饮品商品展示系统',
    version: '1.0.0',
    description: '数字标牌商品展示系统'
  },
  
  // 服务器配置
  server: {
    port: 8088,
    host: '0.0.0.0', // 允许外部访问
    publicPath: '/',
    apiBaseUrl: '/api' // 后端API基础路径（如果有）
  },
  
  // 资源路径
  paths: {
    assets: 'assets', // 静态资源目录
    images: 'assets/images', // 图片资源目录
    data: 'data' // 数据文件目录
  },
  
  // 显示配置
  display: {
    defaultTitle: '咖啡及饮品商品展示系统',
    refreshInterval: 60000, // 自动刷新间隔（毫秒）
    transitionEffect: 'fade', // 页面切换效果
    defaultLanguage: 'zh-CN'
  },
  
  // 功能配置
  features: {
    enableAutoRefresh: true, // 是否启用自动刷新
    enableOfflineMode: true, // 是否支持离线模式
    enableLogging: true, // 是否启用日志记录
    showDebugInfo: false // 是否显示调试信息
  }
}; 