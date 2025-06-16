/**
 * @file start-app.js
 * @description 数字标牌项目启动脚本，执行所有优化措施并启动应用
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 定义颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * 使用颜色输出信息到控制台
 * @param {string} message - 要输出的消息
 * @param {string} color - 颜色代码
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * 安全执行命令
 * @param {string} command - 要执行的命令
 * @param {string} errorMessage - 出错时显示的消息
 * @returns {boolean} - 命令执行是否成功
 */
function safeExec(command, errorMessage) {
  try {
    log(`执行命令: ${command}`, colors.cyan);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`${errorMessage}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * 替换App.vue文件
 */
function replaceAppVue() {
  log('=== 替换App.vue文件 ===', colors.bright + colors.green);
  
  const minimalAppPath = path.join(__dirname, 'src', 'renderer', 'App.vue.minimal');
  const targetAppPath = path.join(__dirname, 'src', 'renderer', 'App.vue');
  
  if (fs.existsSync(minimalAppPath)) {
    try {
      // 备份原始文件
      if (fs.existsSync(targetAppPath)) {
        const backupPath = `${targetAppPath}.backup-${Date.now()}`;
        fs.copyFileSync(targetAppPath, backupPath);
        log(`已备份原始App.vue到: ${backupPath}`, colors.green);
      }
      
      // 复制极简版App.vue
      fs.copyFileSync(minimalAppPath, targetAppPath);
      log('已成功应用极简版App.vue', colors.green);
    } catch (error) {
      log(`替换App.vue失败: ${error.message}`, colors.red);
    }
  } else {
    log('未找到极简版App.vue文件', colors.yellow);
  }
}

/**
 * 清理GPU缓存
 */
function clearGPUCache() {
  log('=== 清理GPU缓存 ===', colors.bright + colors.green);
  
  const appName = '数字标牌商品展示系统'; // 根据实际应用名称调整
  
  // 用户数据目录
  const appDataPath = process.env.APPDATA || 
    (process.platform === 'darwin' ? 
      path.join(process.env.HOME, 'Library/Application Support') : 
      path.join(process.env.HOME, '.config'));
  
  // Electron缓存目录路径
  const cachePaths = [
    path.join(appDataPath, appName, 'GPUCache'),
    path.join(appDataPath, appName, 'Code Cache'),
    path.join(appDataPath, appName, 'Cache'),
    path.join(appDataPath, 'Electron', 'Cache'),
    path.join(process.env.LOCALAPPDATA || appDataPath, 'Electron', 'Cache'),
    path.join(__dirname, '.webpack'),
    path.join(__dirname, '.cache'),
    path.join(__dirname, 'node_modules', '.cache')
  ];
  
  // 尝试清理每个路径
  cachePaths.forEach(cachePath => {
    try {
      if (fs.existsSync(cachePath)) {
        log(`清理缓存: ${cachePath}`, colors.yellow);
        fs.rmSync(cachePath, { recursive: true, force: true });
        log(`已清理: ${cachePath}`, colors.green);
      }
    } catch (error) {
      log(`清理 ${cachePath} 失败: ${error.message}`, colors.red);
    }
  });
}

/**
 * 创建启动脚本
 */
function createStartupScript() {
  log('=== 创建启动脚本 ===', colors.bright + colors.green);
  
  const content = `@echo off
echo ===== 数字标牌应用启动脚本 =====
echo.

:: 设置环境变量
set "ELECTRON_DISABLE_SECURITY_WARNINGS=true"
set "LANG=zh_CN.UTF-8"
set "LANGUAGE=zh_CN.UTF-8"
set "LC_ALL=zh_CN.UTF-8"
set "CHCP=65001"
set "NODE_ENV=development"

:: 清理缓存和准备工作
echo 执行预启动处理...
node prestart.js

:: 使用极简版App.vue
echo 应用极简版App.vue...
node start-app.js --replace-app-vue

:: 启动应用
echo 正在启动应用...
npm run dev

pause
`;

  const scriptPath = path.join(__dirname, 'start-digital-signage.bat');
  
  try {
    fs.writeFileSync(scriptPath, content, 'utf8');
    log(`启动脚本已创建: ${scriptPath}`, colors.green);
  } catch (error) {
    log(`创建启动脚本失败: ${error.message}`, colors.red);
  }
}

/**
 * 主函数
 */
function main() {
  log('=== 数字标牌应用启动工具 ===', colors.bright + colors.blue);
  
  // 处理命令行参数
  const args = process.argv.slice(2);
  const replaceAppVueOnly = args.includes('--replace-app-vue');
  
  if (replaceAppVueOnly) {
    // 只替换App.vue文件
    replaceAppVue();
    return;
  }
  
  // 执行所有优化措施
  clearGPUCache();
  replaceAppVue();
  createStartupScript();
  
  // 运行工具修复脚本
  if (fs.existsSync(path.join(__dirname, 'vue-template-fix.js'))) {
    safeExec('node vue-template-fix.js', '运行Vue模板修复脚本失败');
  }
  
  // 运行预启动脚本
  if (fs.existsSync(path.join(__dirname, 'prestart.js'))) {
    safeExec('node prestart.js', '运行预启动脚本失败');
  }
  
  log('=== 所有准备工作已完成 ===', colors.bright + colors.green);
  log('您现在可以使用以下方式启动应用:', colors.bright);
  log('1. 双击 start-digital-signage.bat', colors.yellow);
  log('2. 运行 npm run dev', colors.yellow);
}

// 执行主函数
main(); 