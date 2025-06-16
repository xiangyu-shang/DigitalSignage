/**
 * Electron应用修复工具
 * 用于解决GPU缓存和中文编码问题
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

// 获取Electron缓存目录
function getElectronCachePaths() {
  const homeDir = os.homedir();
  const possiblePaths = [
    path.join(homeDir, 'AppData', 'Roaming', 'Electron'), // Windows
    path.join(homeDir, 'AppData', 'Local', 'Electron'), // Windows 另一路径
    path.join(homeDir, 'AppData', 'Roaming', '.electron'), // Windows
    path.join(homeDir, 'AppData', 'Local', '.electron'), // Windows 另一路径
    path.join(homeDir, '.electron'), // Linux
    path.join(homeDir, 'Library', 'Caches', 'Electron'), // macOS
    path.join(homeDir, 'Library', 'Application Support', 'Electron'), // macOS
  ];
  
  // 检查GPU缓存文件夹
  const gpuCacheFolders = [
    'GPUCache',
    'Cache',
    'Code Cache',
    'Crashpad',
  ];

  const existingPaths = [];
  
  possiblePaths.forEach(basePath => {
    if (fs.existsSync(basePath)) {
      console.log(`找到Electron目录: ${basePath}`);
      
      gpuCacheFolders.forEach(cacheFolder => {
        const cachePath = path.join(basePath, cacheFolder);
        if (fs.existsSync(cachePath)) {
          existingPaths.push(cachePath);
        }
      });
    }
  });
  
  return existingPaths;
}

// 清理Electron缓存目录
function clearElectronCaches() {
  const cachePaths = getElectronCachePaths();
  
  if (cachePaths.length === 0) {
    console.log('未找到Electron缓存目录');
    return;
  }
  
  cachePaths.forEach(cachePath => {
    try {
      console.log(`尝试清理缓存目录: ${cachePath}`);
      
      // 获取目录中的所有文件
      const files = fs.readdirSync(cachePath);
      
      files.forEach(file => {
        const filePath = path.join(cachePath, file);
        try {
          // 检查文件状态
          const stats = fs.statSync(filePath);
          
          if (stats.isFile()) {
            // 删除文件
            fs.unlinkSync(filePath);
            console.log(`- 已删除文件: ${file}`);
          } else if (stats.isDirectory()) {
            // 递归删除子目录
            // 为简单起见，这里不实现递归删除
            console.log(`- 跳过子目录: ${file}`);
          }
        } catch (err) {
          console.error(`- 无法处理文件 ${file}: ${err.message}`);
        }
      });
      
    } catch (err) {
      console.error(`清理缓存目录失败: ${cachePath}, 错误: ${err.message}`);
    }
  });
  
  console.log('Electron缓存清理完成');
}

// 创建Electron启动脚本
function createLaunchScript() {
  const scriptPath = path.join(__dirname, 'launch-electron.bat');
  const scriptContent = `@echo off
echo 正在启动无GPU缓存的Electron应用...
set ELECTRON_DISABLE_GPU=1
set ELECTRON_NO_ASAR=1
set ELECTRON_NO_ATTACH_CONSOLE=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1
set ELECTRON_DEFAULT_ERROR_MODE=1

cd /d "%~dp0"
electron --disable-gpu --disable-software-rasterizer --disable-gpu-compositing --disable-gpu-rasterization --disable-gpu-sandbox --no-sandbox .

echo 应用已退出，按任意键关闭窗口
pause > nul
`;

  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`启动脚本已创建: ${scriptPath}`);
  return scriptPath;
}

// 生成环境变量配置脚本
function createEnvScript() {
  const scriptPath = path.join(__dirname, 'set-env.bat');
  const scriptContent = `@echo off
echo 设置Electron环境变量...

set ELECTRON_DISABLE_GPU=1
set ELECTRON_NO_ASAR=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_DISABLE_SECURITY_WARNINGS=1
set LANG=zh_CN.UTF-8
set LC_ALL=zh_CN.UTF-8
set LC_CTYPE=zh_CN.UTF-8

echo 环境变量设置完成，可以启动应用
`;

  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`环境变量脚本已创建: ${scriptPath}`);
  return scriptPath;
}

// 生成package.json脚本修改建议
function generatePackageJsonSuggestion() {
  console.log('\n===== package.json 脚本修改建议 =====');
  console.log(`"scripts": {
  "dev": "cross-env ELECTRON_DISABLE_SECURITY_WARNINGS=true CHCP=65001 webpack serve --config webpack.config.js",
  "build": "cross-env NODE_ENV=production webpack --config webpack.config.js && electron-builder",
  "electron:dev": "cross-env ELECTRON_DISABLE_GPU=1 NODE_ENV=development concurrently \\
    \\"npm run dev\\" \\
    \\"electron --disable-gpu --disable-software-rasterizer --no-sandbox --js-flags=--max-old-space-size=4096 .\\"",
  "electron:dev:safe": "cross-env ELECTRON_DISABLE_GPU=1 NODE_ENV=development concurrently \\
    \\"npm run dev\\" \\
    \\"electron --disable-gpu --disable-software-rasterizer --disable-gpu-compositing --disable-gpu-rasterization --disable-gpu-sandbox --no-sandbox .\\"",
  "electron:build": "cross-env NODE_ENV=production npm run build && electron-builder"
}`);
}

// 执行所有修复
console.log('===== Electron应用修复工具 =====');
console.log('正在检查和清理GPU缓存目录...');
clearElectronCaches();

console.log('\n正在创建辅助脚本...');
createLaunchScript();
createEnvScript();

generatePackageJsonSuggestion();

console.log('\n===== 修复完成 =====');
console.log('1. 您可以运行 launch-electron.bat 以无GPU模式启动应用');
console.log('2. 您可以运行 set-env.bat 设置必要的环境变量');
console.log('3. 请考虑按照上述建议修改 package.json 中的脚本');
console.log('\n如果问题仍然存在，请考虑在启动前彻底清理Electron缓存'); 