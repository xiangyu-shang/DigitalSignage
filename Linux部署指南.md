# 咖啡及饮品商品展示系统 - Linux部署指南

本文档提供在Linux系统上部署"咖啡及饮品商品展示系统"的完整步骤。该系统基于Electron和Vue.js构建，用于展示咖啡及饮品商品信息。

## 目录

1. [系统架构概述](#系统架构概述)
2. [环境要求](#环境要求)
3. [基础环境安装](#基础环境安装)
4. [源代码获取与准备](#源代码获取与准备)
5. [项目依赖安装](#项目依赖安装)
6. [应用配置](#应用配置)
7. [构建应用](#构建应用)
8. [应用打包](#应用打包)
9. [系统部署](#系统部署)
10. [自动启动配置](#自动启动配置)
11. [故障排除](#故障排除)
12. [维护与更新](#维护与更新)

## 系统架构概述

该数字标牌系统采用以下技术栈构建：

- **前端框架**: Vue.js 3.x
- **桌面应用框架**: Electron 26.x
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **构建工具**: Webpack 5
- **打包工具**: Electron Builder

系统主要由以下部分组成：

1. **主进程** (`src/main/`): Electron主进程，负责创建窗口、管理应用生命周期
2. **渲染进程** (`src/renderer/`): Vue.js应用，负责UI展示和用户交互
3. **预加载脚本** (`src/main/preload.js`): 安全地连接主进程和渲染进程
4. **自定义配置** (`electron-custom-config.js`): 解决硬件加速和缓存问题

## 环境要求

- Linux发行版 (推荐Ubuntu 20.04 LTS或更高版本)
- Node.js 16.x或更高版本
- npm 8.x或更高版本
- Git

## 基础环境安装

以下命令以Ubuntu/Debian系统为例：

```bash
# 更新系统包
sudo apt update
sudo apt upgrade -y

# 安装Node.js和npm (使用NodeSource仓库获取最新版本)
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v

# 安装构建工具和依赖库
sudo apt install -y build-essential git libgtk-3-0 libnotify-dev \
    libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

## 源代码获取与准备

```bash
# 使用Git克隆项目代码 (如果是通过其他方式获取代码，请跳过此步骤)
git clone [项目仓库URL] digital-signage
cd digital-signage

# 如果直接复制代码，创建项目目录并上传代码
mkdir -p ~/digital-signage
# 然后将代码复制到此目录
cd ~/digital-signage
```

## 项目依赖安装

```bash
# 安装项目依赖
npm install

# 如果在安装过程中遇到问题，可以尝试以下命令
npm install --no-optional --no-shrinkwrap --no-package-lock

# 如果Electron下载失败，可以设置镜像
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm install
```

## 应用配置

1. 创建应用配置文件：

```bash
# 确保electron-custom-config.js文件存在
touch electron-custom-config.js
```

2. 编辑`electron-custom-config.js`文件，添加以下内容：

```javascript
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
```

3. 修改`src/main/index.js`中的操作系统相关代码，确保在Linux上正常工作：

```bash
# 编辑src/main/index.js文件
# 找到Windows相关的代码（如setAutoLaunch函数），确保它在Linux上也能工作
```

## 构建应用

1. 前端资源构建:

```bash
# 开发模式构建
npm run dev

# 生产模式构建
NODE_ENV=production npm run build
```

## 应用打包

使用Electron Builder打包Linux应用：

```bash
# 安装必要的打包依赖
sudo apt install -y fakeroot dpkg rpm

# 修改package.json，添加Linux打包配置
# 编辑package.json文件，确保有以下配置
# "build": {
#   "linux": {
#     "target": ["AppImage", "deb"],
#     "category": "Office"
#   }
# }

# 执行打包命令
npm run electron:build
```

这将在`release`目录下生成以下文件：
- `.AppImage`: 便携式应用，无需安装，可直接运行
- `.deb`: Debian/Ubuntu安装包

## 系统部署

### 方法1: 使用AppImage（推荐）

AppImage是一个便携式应用，无需安装即可运行：

```bash
# 给AppImage添加执行权限
chmod +x release/*.AppImage

# 运行应用
./release/咖啡及饮品商品展示系统-*.AppImage
```

### 方法2: 使用DEB包安装

```bash
# 安装DEB包
sudo dpkg -i release/咖啡及饮品商品展示系统-*.deb
sudo apt-get install -f  # 修复可能的依赖问题

# 运行应用
咖啡及饮品商品展示系统
```

### 方法3: 手动从源代码运行

```bash
# 开发模式运行
npm run electron:dev

# 或者，从构建后的文件运行
npm run start
```

## 自动启动配置

### 使用systemd（推荐服务器使用）

1. 创建systemd服务文件：

```bash
sudo nano /etc/systemd/system/digital-signage.service
```

2. 添加以下内容：

```
[Unit]
Description=咖啡及饮品商品展示系统
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
ExecStart=/full/path/to/咖啡及饮品商品展示系统-*.AppImage
Restart=always
RestartSec=5
StartLimitInterval=0
WorkingDirectory=/full/path/to/app/directory

[Install]
WantedBy=multi-user.target
```

3. 启用并启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable digital-signage.service
sudo systemctl start digital-signage.service
```

### 使用桌面自启动（推荐桌面系统使用）

1. 创建桌面启动项：

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/digital-signage.desktop
```

2. 添加以下内容：

```
[Desktop Entry]
Type=Application
Name=咖啡及饮品商品展示系统
Comment=咖啡及饮品商品展示系统
Exec=/full/path/to/咖啡及饮品商品展示系统-*.AppImage
Icon=/full/path/to/icon.png
Terminal=false
Categories=Office;
```

## 故障排除

### 白屏问题

如果应用启动后显示白屏：

1. 检查日志：
```bash
cat ~/.config/咖啡及饮品商品展示系统/logs/app-*.log
```

2. 启用调试模式：
```bash
ELECTRON_ENABLE_LOGGING=true ELECTRON_ENABLE_STACK_DUMPING=true ./咖啡及饮品商品展示系统-*.AppImage
```

3. 修改`src/main/index.js`，添加以下代码启用开发者工具：
```javascript
mainWindow.webContents.openDevTools();
```

### 常见Linux特定问题

1. **依赖缺失**：某些Linux发行版可能缺少必要的库。解决方案：
```bash
sudo apt install -y libgtk-3-0 libnotify-dev libnss3 libxss1 libasound2 libxtst6
```

2. **无法使用GPU加速**：如果遇到图形渲染问题，请确保已正确禁用GPU加速：
```bash
# 在electron-custom-config.js中确保这些设置已添加
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
```

3. **字体渲染问题**：如果中文字体显示不正确：
```bash
# 安装中文字体
sudo apt install -y fonts-wqy-microhei fonts-wqy-zenhei
```

## 维护与更新

### 手动更新

1. 停止当前运行的应用：
```bash
# 如果使用systemd
sudo systemctl stop digital-signage.service

# 或者直接终止进程
pkill -f 咖啡及饮品商品展示系统
```

2. 备份数据（如果有）：
```bash
cp -r ~/.config/咖啡及饮品商品展示系统 ~/咖啡及饮品商品展示系统-backup-$(date +%Y%m%d)
```

3. 替换新版本的AppImage或重新安装DEB包。

### 远程部署建议

对于需要远程部署多台设备的情况：

1. 创建部署脚本：
```bash
#!/bin/bash
# deploy.sh

# 停止正在运行的应用
systemctl --user stop digital-signage.service || true
pkill -f 咖啡及饮品商品展示系统 || true

# 备份旧版本
mv ~/咖啡及饮品商品展示系统-*.AppImage ~/咖啡及饮品商品展示系统-backup.AppImage || true

# 复制新版本
cp /path/to/new/咖啡及饮品商品展示系统-*.AppImage ~/

# 设置执行权限
chmod +x ~/咖啡及饮品商品展示系统-*.AppImage

# 重启应用
systemctl --user start digital-signage.service || ~/咖啡及饮品商品展示系统-*.AppImage &
```

2. 使用SSH远程执行部署脚本：
```bash
ssh user@remote-host 'bash -s' < deploy.sh
```

## 结语

通过以上步骤，您应该能够在Linux系统上成功部署和运行咖啡及饮品商品展示系统。如遇到任何问题，请参考日志文件或联系技术支持。 