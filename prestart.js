/**
 * @file prestart.js
 * @description 启动应用前的准备工作，包括清理GPU缓存、修复文件编码和安装依赖
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * 打印彩色信息
 * @param {string} message - 消息文本
 * @param {string} color - 颜色代码
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * 安全执行命令
 * @param {string} command - 要执行的命令
 * @param {string} errorMessage - 错误提示信息
 */
function safeExec(command, errorMessage) {
  try {
    log(`执行: ${command}`, colors.cyan);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`${errorMessage}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * 清理GPU缓存
 */
function clearGPUCache() {
  log('=== 清理GPU缓存 ===', colors.bright + colors.green);
  
  // 用户数据目录
  const appDataPath = process.env.APPDATA || 
    (process.platform === 'darwin' ? 
      path.join(process.env.HOME, 'Library/Application Support') : 
      path.join(process.env.HOME, '.config'));
  
  // Electron GPU缓存目录 - 根据你的应用名称调整
  const cachePaths = [
    path.join(appDataPath, '应用名称', 'GPUCache'),
    path.join(appDataPath, '应用名称', 'Code Cache'),
    path.join(__dirname, '.webpack'),
    path.join(__dirname, '.cache')
  ];
  
  // 清理每个缓存目录
  cachePaths.forEach(cachePath => {
    if (fs.existsSync(cachePath)) {
      try {
        log(`清理: ${cachePath}`, colors.yellow);
        fs.rmSync(cachePath, { recursive: true, force: true });
        log(`已清理: ${cachePath}`, colors.green);
      } catch (error) {
        log(`清理缓存失败: ${error.message}`, colors.red);
      }
    }
  });
}

/**
 * 修复Vue模板文件
 */
function fixVueTemplates() {
  log('=== 修复Vue模板文件 ===', colors.bright + colors.green);
  
  // 尝试运行vue-template-fix.js
  if (fs.existsSync(path.join(__dirname, 'vue-template-fix.js'))) {
    safeExec('node vue-template-fix.js', '运行Vue模板修复脚本失败');
  } else {
    log('Vue模板修复脚本不存在，跳过此步骤', colors.yellow);
  }
}

/**
 * 更新package.json中的启动脚本
 */
function updatePackageScripts() {
  log('=== 更新启动脚本 ===', colors.bright + colors.green);
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  try {
    // 读取package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // 使用更安全的启动参数
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.dev = 'cross-env ELECTRON_DISABLE_SECURITY_WARNINGS=true CHCP=65001 webpack serve --config webpack.config.js';
    packageJson.scripts.build = 'cross-env NODE_ENV=production webpack --config webpack.config.js && electron-builder';
    packageJson.scripts.start = 'node prestart.js && npm run dev';
    
    // 添加Electron启动参数
    packageJson.electronConfig = {
      extraArgs: [
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-gpu-compositing',
        '--disable-gpu-rasterization',
        '--disable-2d-canvas-clip-aa',
        '--disable-dev-shm-usage',
        '--no-sandbox'
      ]
    };
    
    // 写回package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    log('package.json更新成功', colors.green);
  } catch (error) {
    log(`更新package.json失败: ${error.message}`, colors.red);
  }
}

/**
 * 创建启动脚本
 */
function createLaunchScript() {
  log('=== 创建启动脚本 ===', colors.bright + colors.green);
  
  const startScriptPath = path.join(__dirname, 'start.bat');
  const scriptContent = `@echo off
echo 正在启动数字标牌应用...
set "ELECTRON_DISABLE_SECURITY_WARNINGS=true"
set "LANG=zh_CN.UTF-8"
set "LANGUAGE=zh_CN.UTF-8"
set "LC_ALL=zh_CN.UTF-8"
set "CHCP=65001"
set "NODE_ENV=development"

:: 清理GPU缓存 (可选)
node prestart.js

:: 启动应用
npm run dev
pause
`;

  try {
    fs.writeFileSync(startScriptPath, scriptContent, 'utf8');
    log(`启动脚本已创建: ${startScriptPath}`, colors.green);
  } catch (error) {
    log(`创建启动脚本失败: ${error.message}`, colors.red);
  }
}

/**
 * 主函数
 */
function main() {
  log('===== 数字标牌应用启动准备 =====', colors.bright + colors.magenta);
  
  // 1. 清理GPU缓存
  clearGPUCache();
  
  // 2. 修复Vue模板
  fixVueTemplates();
  
  // 3. 更新package.json
  updatePackageScripts();
  
  // 4. 创建启动脚本
  createLaunchScript();
  
  log('===== 准备工作完成 =====', colors.bright + colors.green);
  log('请使用 start.bat 或 npm run start 启动应用', colors.bright + colors.cyan);
}

// 执行主函数
main(); 