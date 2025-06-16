#!/bin/bash

# 咖啡及饮品商品展示系统 - Linux启动脚本
# 此脚本用于在Linux系统上启动应用程序

# 设置应用程序路径
APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$APP_DIR"

# 创建日志目录
mkdir -p logs
LOG_FILE="logs/app-$(date +%Y%m%d-%H%M%S).log"

# 输出基本信息
echo "====================================================" | tee -a "$LOG_FILE"
echo "咖啡及饮品商品展示系统 - 启动脚本" | tee -a "$LOG_FILE"
echo "启动时间: $(date)" | tee -a "$LOG_FILE"
echo "工作目录: $APP_DIR" | tee -a "$LOG_FILE"
echo "====================================================" | tee -a "$LOG_FILE"

# 检查Node.js环境
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v)
    echo "检测到Node.js版本: $NODE_VERSION" | tee -a "$LOG_FILE"
else
    echo "错误: 未检测到Node.js环境，请先安装Node.js" | tee -a "$LOG_FILE"
    exit 1
fi

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "警告: 未找到dist目录，尝试构建前端资源..." | tee -a "$LOG_FILE"
    
    # 检查是否有package.json
    if [ -f "package.json" ]; then
        echo "正在安装依赖..." | tee -a "$LOG_FILE"
        npm install 2>&1 | tee -a "$LOG_FILE"
        
        echo "正在构建前端资源..." | tee -a "$LOG_FILE"
        NODE_ENV=production npm run build 2>&1 | tee -a "$LOG_FILE"
    else
        echo "错误: 无法找到package.json文件，无法构建前端资源" | tee -a "$LOG_FILE"
        exit 1
    fi
fi

# 检查electron-custom-config.js是否存在
if [ ! -f "electron-custom-config.js" ]; then
    echo "警告: 未找到electron-custom-config.js文件，将创建默认配置..." | tee -a "$LOG_FILE"
    
    # 创建electron-custom-config.js文件
    cat > electron-custom-config.js << 'EOL'
/**
 * Electron自定义配置文件
 * 此文件在应用程序启动时被加载，可以修改Electron的行为和设置
 */

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
      try {
        // 在Linux上使用.config目录
        const homeDir = process.env.HOME;
        const appConfigDir = path.join(homeDir, '.config', '咖啡及饮品商品展示系统');
        
        // 确保配置目录存在
        if (!fs.existsSync(appConfigDir)) {
          fs.mkdirSync(appConfigDir, { recursive: true });
        }
        
        // 设置应用数据目录
        app.setPath('userData', appConfigDir);
        console.log(`自定义配置: 设置userData路径为 ${appConfigDir}`);
        
        // 设置日志目录
        const logsPath = path.join(appConfigDir, 'logs');
        if (!fs.existsSync(logsPath)) {
          fs.mkdirSync(logsPath, { recursive: true });
        }
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
    extraIndexPaths: [
      'dist/index.html',
      'resources/app/dist/index.html',
      'app/dist/index.html'
    ]
  },
  rendererFixes: {
    injectDevTools: true,
    forceReload: false,
    bypassWebSecurity: true
  }
};
EOL
    
    echo "已创建默认配置文件" | tee -a "$LOG_FILE"
fi

# 设置环境变量
export ELECTRON_ENABLE_LOGGING=true
export ELECTRON_ENABLE_STACK_DUMPING=true
export NODE_ENV=production
export DISPLAY=:0  # 确保在图形环境中运行

# 检查运行方式
if [ -f "release/咖啡及饮品商品展示系统-"*".AppImage" ]; then
    # 使用AppImage运行
    echo "找到AppImage文件，使用AppImage启动应用..." | tee -a "$LOG_FILE"
    
    # 设置可执行权限
    chmod +x release/咖啡及饮品商品展示系统-*.AppImage
    
    # 启动应用
    release/咖啡及饮品商品展示系统-*.AppImage --no-sandbox --disable-gpu 2>&1 | tee -a "$LOG_FILE"
elif [ -f "node_modules/.bin/electron" ]; then
    # 使用electron命令运行
    echo "使用本地electron命令启动应用..." | tee -a "$LOG_FILE"
    
    # 启动应用
    node_modules/.bin/electron --no-sandbox --disable-gpu . 2>&1 | tee -a "$LOG_FILE"
elif command -v electron >/dev/null 2>&1; then
    # 使用全局electron命令运行
    echo "使用全局electron命令启动应用..." | tee -a "$LOG_FILE"
    
    # 启动应用
    electron --no-sandbox --disable-gpu . 2>&1 | tee -a "$LOG_FILE"
else
    # 尝试使用npx启动
    echo "尝试使用npx启动应用..." | tee -a "$LOG_FILE"
    
    # 启动应用
    npx electron --no-sandbox --disable-gpu . 2>&1 | tee -a "$LOG_FILE"
fi

# 捕获退出代码
EXIT_CODE=$?

# 输出结束信息
echo "====================================================" | tee -a "$LOG_FILE"
echo "应用程序已退出，退出代码: $EXIT_CODE" | tee -a "$LOG_FILE"
echo "结束时间: $(date)" | tee -a "$LOG_FILE"
echo "====================================================" | tee -a "$LOG_FILE"

exit $EXIT_CODE 