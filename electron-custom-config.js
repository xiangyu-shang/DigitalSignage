/**
 * @file electron-custom-config.js
 * @description 自定义Electron配置，主要用于解决GPU和渲染相关问题
 */

// 此文件可在 main.js 或 index.js 开头引入: require('./electron-custom-config')

// 确保我们在Node环境中
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  try {
    const { app } = require('electron');
    const path = require('path');
    const fs = require('fs');
    
    // 如果electron模块已加载（主进程中）
    if (app) {
      console.log('加载自定义配置...');
      
      // 启用详细日志记录
      process.env.ELECTRON_ENABLE_LOGGING = 'true';
      process.env.ELECTRON_ENABLE_STACK_DUMPING = 'true';
      
      // 设置缓存目录
      // 尝试在应用程序目录下创建缓存目录，避免使用系统目录（可能遇到权限问题）
      try {
        const execPath = app.getPath('exe');
        const appDir = path.dirname(execPath);
        const portableCachePath = path.join(appDir, 'cache');
        
        // 确保缓存目录存在
        if (!fs.existsSync(portableCachePath)) {
          fs.mkdirSync(portableCachePath, { recursive: true });
        }
        
        // 设置应用数据目录到便携目录
        app.setPath('userData', portableCachePath);
        console.log(`自定义配置: 设置userData路径为 ${portableCachePath}`);
        
        // 设置日志目录
        const logsPath = path.join(appDir, 'logs');
        if (!fs.existsSync(logsPath)) {
          fs.mkdirSync(logsPath, { recursive: true });
        }
        
        // 重定向控制台输出到日志文件
        const logFile = path.join(logsPath, `app-${new Date().toISOString().replace(/:/g, '-')}.log`);
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });
        
        // 保存原始的控制台方法
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        
        // 重定向控制台输出
        console.log = function() {
          const args = Array.from(arguments);
          originalConsoleLog.apply(console, args);
          logStream.write(`[LOG] ${args.join(' ')}\n`);
        };
        
        console.error = function() {
          const args = Array.from(arguments);
          originalConsoleError.apply(console, args);
          logStream.write(`[ERROR] ${args.join(' ')}\n`);
        };
        
        console.warn = function() {
          const args = Array.from(arguments);
          originalConsoleWarn.apply(console, args);
          logStream.write(`[WARN] ${args.join(' ')}\n`);
        };
        
        console.log('自定义配置: 日志已重定向到 ' + logFile);
      } catch (error) {
        console.error('自定义配置: 设置缓存目录失败', error);
      }
      
      // 禁用硬件加速以解决一些图形问题
      app.disableHardwareAcceleration();
      console.log('自定义配置: 已禁用硬件加速');
      
      // 添加命令行开关
      app.commandLine.appendSwitch('disable-http-cache');
      app.commandLine.appendSwitch('disable-gpu');
      app.commandLine.appendSwitch('no-sandbox');
      app.commandLine.appendSwitch('disable-web-security');
      app.commandLine.appendSwitch('allow-file-access-from-files');
      console.log('自定义配置: 已添加命令行开关');
      
      // 在应用退出前执行清理操作
      app.on('will-quit', () => {
        console.log('应用正在退出，执行清理操作...');
        // 关闭日志流
        if (logStream) {
          logStream.end('应用程序已关闭\n');
        }
      });
      
      // 设置最长捕获异常堆栈
      Error.stackTraceLimit = Infinity;
      
      console.log('自定义配置: 加载完成');
    }
  } catch (error) {
    console.error('加载自定义配置时出错:', error);
  }
}

// 导出自定义设置供其他模块使用
module.exports = {
  customDebugEnabled: true,
  pathFixes: {
    // 添加额外的索引文件搜索路径
    extraIndexPaths: [
      'dist/index.html',
      'resources/app/dist/index.html',
      'app/dist/index.html'
    ]
  },
  rendererFixes: {
    // 前端修复选项
    injectDevTools: true,  // 是否注入开发者工具
    forceReload: false,    // 是否强制重新加载页面
    bypassWebSecurity: true // 是否绕过网页安全策略
  }
};

// 如果直接执行了该文件，则立即应用配置
if (require.main === module) {
  try {
    const { app } = require('electron');
    if (app) {
      module.exports(app);
    }
  } catch (error) {
    console.error('直接执行配置文件失败:', error.message);
  }
} 