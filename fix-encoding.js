/**
 * @file fix-encoding.js
 * @description 解决Windows系统下Electron项目的中文编码问题
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const iconv = require('iconv-lite');

// 创建控制台彩色输出
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

// 输出格式化消息
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// 检查并安装依赖
function checkAndInstallDependencies() {
  log('=== Checking dependencies ===', colors.bright + colors.blue);
  
  try {
    require('iconv-lite');
    log('iconv-lite is installed', colors.green);
  } catch (error) {
    log('Installing iconv-lite...', colors.yellow);
    execSync('npm install iconv-lite --save', { stdio: 'inherit' });
  }
}

// 转换文件编码
function convertFileEncoding(filePath, fromEncoding, toEncoding) {
  log(`Converting ${path.basename(filePath)} from ${fromEncoding} to ${toEncoding}...`, colors.cyan);
  
  try {
    // 读取文件
    const content = fs.readFileSync(filePath);
    
    // 检测是否有BOM头
    const hasBOM = content.length >= 3 && 
                   content[0] === 0xEF && 
                   content[1] === 0xBB && 
                   content[2] === 0xBF;
    
    // 去掉BOM头并解码
    const fileContent = hasBOM ? 
                     iconv.decode(content.slice(3), fromEncoding) : 
                     iconv.decode(content, fromEncoding);
    
    // 编码为目标格式并写回
    const convertedContent = iconv.encode(fileContent, toEncoding);
    
    // 备份原文件
    fs.copyFileSync(filePath, `${filePath}.bak`);
    
    // 写入新文件
    fs.writeFileSync(filePath, convertedContent);
    
    log(`Successfully converted ${path.basename(filePath)}`, colors.green);
    return true;
  } catch (error) {
    log(`Error converting ${path.basename(filePath)}: ${error.message}`, colors.red);
    return false;
  }
}

// 修复Electron主进程文件
function fixElectronMainProcess() {
  log('=== Fixing Electron main process ===', colors.bright + colors.magenta);
  
  const mainFile = path.join(__dirname, 'src', 'main', 'index.js');
  
  // 转换main process文件
  if (fs.existsSync(mainFile)) {
    convertFileEncoding(mainFile, 'GBK', 'UTF8');
    
    // 读取转换后的文件
    let content = fs.readFileSync(mainFile, 'utf8');
    
    // 添加正确的编码输出设置
    if (!content.includes('process.env.CHCP')) {
      const insertPos = content.indexOf('const { app');
      if (insertPos !== -1) {
        content = content.slice(0, insertPos) + 
                 '// 设置控制台输出编码\n' +
                 'process.env.CHCP = \'65001\';\n' +
                 'try { require(\'child_process\').execSync(\'chcp 65001\', {stdio: \'ignore\'}); } catch (e) {}\n\n' +
                 content.slice(insertPos);
        
        fs.writeFileSync(mainFile, content, 'utf8');
        log('Added console encoding fix to main process', colors.green);
      }
    }
  } else {
    log(`Main process file not found at: ${mainFile}`, colors.red);
  }
}

// 创建修复批处理文件
function createFixBatchFile() {
  log('=== Creating fix batch file ===', colors.bright + colors.blue);
  
  const batchContent = `@echo off
echo Setting console to UTF-8 mode...
chcp 65001
echo Console is now in UTF-8 mode

echo Installing dependencies...
npm install

echo Setting up environment...
set ELECTRON_DISABLE_SECURITY_WARNINGS=true
set LANG=zh_CN.UTF-8
set LC_ALL=zh_CN.UTF-8
set NODE_ENV=development

echo Starting application...
npm run dev
pause
`;
  
  const batchPath = path.join(__dirname, 'start-utf8.bat');
  fs.writeFileSync(batchPath, batchContent, 'utf8');
  
  log(`Created UTF-8 batch file at: ${batchPath}`, colors.green);
}

// 创建预加载脚本增强版
function enhancePreloadScript() {
  log('=== Enhancing preload script ===', colors.bright + colors.blue);
  
  const preloadPath = path.join(__dirname, 'src', 'preload', 'index.js');
  
  if (fs.existsSync(preloadPath)) {
    // 备份原文件
    fs.copyFileSync(preloadPath, `${preloadPath}.bak`);
    
    let content = fs.readFileSync(preloadPath, 'utf8');
    
    // 添加编码修复逻辑
    const encodingFix = `
// 应用启动时设置文档编码
window.addEventListener('DOMContentLoaded', () => {
  // 确保使用UTF-8编码
  document.querySelector('head').innerHTML += '<meta charset="UTF-8">';
  document.querySelector('head').innerHTML += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
  
  console.log('Preload script: UTF-8 encoding enforced');
});
`;
    
    // 将修复逻辑添加到文件末尾
    content += encodingFix;
    
    fs.writeFileSync(preloadPath, content, 'utf8');
    log('Enhanced preload script with encoding fixes', colors.green);
  } else {
    log(`Preload script not found at: ${preloadPath}`, colors.yellow);
  }
}

// 修复package.json
function fixPackageJson() {
  log('=== Fixing package.json ===', colors.bright + colors.blue);
  
  const packagePath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // 修改scripts部分
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.dev = 'cross-env ELECTRON_DISABLE_SECURITY_WARNINGS=true CHCP=65001 webpack serve --config webpack.config.js';
      packageJson.scripts.start = 'node fix-encoding.js && npm run dev';
      
      // 添加UTF-8相关配置
      packageJson.electronConfig = packageJson.electronConfig || {};
      packageJson.electronConfig.env = {
        LANG: 'zh_CN.UTF-8',
        LC_ALL: 'zh_CN.UTF-8',
        CHCP: '65001'
      };
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
      log('Updated package.json with encoding settings', colors.green);
    } catch (error) {
      log(`Error updating package.json: ${error.message}`, colors.red);
    }
  } else {
    log(`Package.json not found at: ${packagePath}`, colors.red);
  }
}

// 主函数
function main() {
  log('===== Windows 中文编码问题修复工具 =====', colors.bright + colors.magenta);
  
  // 检查并安装依赖
  checkAndInstallDependencies();
  
  // 修复主进程文件编码
  fixElectronMainProcess();
  
  // 创建UTF-8批处理文件
  createFixBatchFile();
  
  // 增强预加载脚本
  enhancePreloadScript();
  
  // 修复package.json
  fixPackageJson();
  
  log('===== 修复完成 =====', colors.bright + colors.green);
  log('请使用以下命令启动应用:', colors.bright);
  log('1. start-utf8.bat', colors.yellow);
  log('2. npm run start', colors.yellow);
}

// 执行主函数
main(); 