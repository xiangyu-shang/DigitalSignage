// 设置控制台输出编码
process.env.CHCP = '65001';
try { require('child_process').execSync('chcp 65001', {stdio: 'ignore'}); } catch (e) {}

// 引入自定义配置，必须在所有其他代码之前
try {
  require('../../electron-custom-config');
} catch (e) {
  console.error('加载自定义配置失败，但将继续启动应用:', e.message);
}

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// 配置Node.js进程的编码
process.env.LANG = 'zh_CN.UTF-8';
process.env.LC_ALL = 'zh_CN.UTF-8';
process.env.LC_CTYPE = 'zh_CN.UTF-8';

// 彻底禁用GPU加速，解决相关缓存错误
app.disableHardwareAcceleration();

// 设置命令行启动参数
try {
  const electronConfig = require('../../package.json').electronConfig || {};
  if (electronConfig.extraArgs && Array.isArray(electronConfig.extraArgs)) {
    electronConfig.extraArgs.forEach(arg => {
      app.commandLine.appendSwitch(arg.replace('--', ''));
    });
  }
} catch (e) {
  console.error('读取package.json配置失败，但将继续启动应用:', e.message);
}

// 添加额外的命令行参数
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
app.commandLine.appendSwitch('disable-dev-shm-usage');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('lang', 'zh-CN');

// 设置应用环境变量
process.env.LANG = 'zh_CN.UTF-8';
process.env.LANGUAGE = 'zh_CN.UTF-8';
process.env.LC_ALL = 'zh_CN.UTF-8';

// 设置专用缓存目录（避免权限问题）
try {
  // 为便携版应用设置一个本地缓存目录
  const portableCachePath = path.join(path.dirname(app.getPath('exe')), 'cache');
  app.setPath('userData', portableCachePath);
  console.log(`缓存目录设置为: ${portableCachePath}`);
} catch (error) {
  console.error('设置缓存目录失败:', error);
  // 使用应用目录作为备选方案
  app.setPath('userData', path.join(__dirname, 'cache'));
}

// 清理GPU缓存路径
try {
  const userDataPath = app.getPath('userData');
  const cachePath = path.join(userDataPath, 'GPUCache');
  console.log(`检查GPU缓存路径: ${cachePath}`);
} catch (error) {
  console.error('获取用户数据路径失败:', error);
}

/**
 * 主窗口实例
 * @type {BrowserWindow | null}
 */
let mainWindow = null;

/**
 * 创建主窗口
 */
function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // 允许加载本地资源
      nativeWindowOpen: true,
      // 添加安全的上下文隔离
      contextIsolation: true,
      // 添加对Vue模板的额外支持
      additionalArguments: ['--lang=zh-CN'],
    },
    // 设置应用窗口样式
    frame: true, // 有边框窗口
    fullscreenable: true,
    resizable: true, // 允许调整大小
    center: true, // 窗口居中显示
    show: false, // 先不显示窗口，等待内容加载完成
    icon: path.join(__dirname, '../../public/icon.ico')
  });

  // 内容加载完成后再显示窗口，避免白屏
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // 始终打开开发者工具，用于调试白屏问题
    mainWindow.webContents.openDevTools();
  });

  // 根据环境加载页面
  // 默认为开发环境，除非明确设置为生产环境
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    // 开发环境下加载Webpack开发服务器
    mainWindow.loadURL('http://localhost:8080');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
    
    // 添加Chrome flags以解决中文处理问题
    app.commandLine.appendSwitch('--lang', 'zh-CN');
  } else {
    // 生产环境下加载构建后的文件
    try {
      // 首先尝试常规生产环境路径
      const indexPath = path.join(__dirname, '../../dist/index.html');
      console.log('尝试加载路径:', indexPath);
      
      if (fs.existsSync(indexPath)) {
        console.log('找到index.html，正在加载...');
        mainWindow.loadURL(
          url.format({
            pathname: indexPath,
            protocol: 'file:',
            slashes: true,
          })
        );
      } else {
        // 如果标准路径不存在，尝试便携版路径
        const portableIndexPath = path.join(path.dirname(app.getPath('exe')), 'resources/app/dist/index.html');
        console.log('标准路径未找到，尝试便携版路径:', portableIndexPath);
        
        if (fs.existsSync(portableIndexPath)) {
          console.log('找到便携版index.html，正在加载...');
          mainWindow.loadURL(
            url.format({
              pathname: portableIndexPath,
              protocol: 'file:',
              slashes: true,
            })
          );
        } else {
          // 如果两种路径都不存在，尝试第三种路径（直接从应用根目录查找）
          const rootIndexPath = path.join(app.getAppPath(), 'dist/index.html');
          console.log('尝试从应用根目录加载:', rootIndexPath);
          
          if (fs.existsSync(rootIndexPath)) {
            console.log('找到应用根目录index.html，正在加载...');
            mainWindow.loadURL(
              url.format({
                pathname: rootIndexPath,
                protocol: 'file:',
                slashes: true,
              })
            );
          } else {
            // 所有路径都失败，显示错误消息
            console.error('无法找到index.html文件，尝试的路径:', indexPath, portableIndexPath, rootIndexPath);
            dialog.showErrorBox(
              '应用加载失败', 
              '无法找到应用程序资源。请确保应用程序完整。\n' +
              `尝试加载的路径:\n${indexPath}\n${portableIndexPath}\n${rootIndexPath}`
            );
          }
        }
      }
    } catch (error) {
      console.error('加载页面失败:', error);
      dialog.showErrorBox('应用加载失败', `错误信息: ${error.message}`);
    }
  }

  // 窗口创建后绑定一些事件处理程序
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
    
    // 显示欢迎对话框
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '咖啡及饮品商品展示系统',
      message: '应用已成功启动',
      detail: '欢迎使用咖啡及饮品商品展示系统，点击确定继续。',
      buttons: ['确定']
    });
  });

  // 捕获渲染进程错误
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('渲染进程崩溃:', details.reason);
    dialog.showErrorBox('应用崩溃', `渲染进程崩溃，原因: ${details.reason}`);
  });

  // 捕获页面崩溃
  mainWindow.webContents.on('crashed', () => {
    console.error('页面崩溃');
    dialog.showErrorBox('页面崩溃', '应用页面崩溃，请重启应用');
  });

  // 监听DOM就绪事件
  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM已就绪');
    // 注入自定义脚本解决Vue模板问题
    mainWindow.webContents.executeJavaScript(`
      console.log('正在注入自定义修复脚本');
      // 替换Vue.js中的模板解析器(如果需要)
      if (window.Vue) {
        const originalCompile = window.Vue.compile;
        if (originalCompile) {
          window.Vue.compile = function(template) {
            // 预处理模板
            template = template.replace(/{{([^}]+)}}/g, function(match, expr) {
              return '{{ ' + expr.trim() + ' }}';
            });
            return originalCompile.call(this, template);
          };
        }
      }
    `);
  });

  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用准备就绪时创建窗口
app.whenReady().then(() => {
  // 创建窗口前确保环境准备就绪
  try {
    // 如果存在electron-custom-config.js文件，则加载它
    const customConfigPath = path.join(__dirname, '../../electron-custom-config.js');
    if (fs.existsSync(customConfigPath)) {
      require(customConfigPath);
    }
  } catch (error) {
    console.error('加载自定义配置失败:', error);
  }
  
  createWindow();

  // 设置应用开机自启动
  try {
    setAutoLaunch(true);
  } catch (e) {
    console.error('设置自动启动失败，但将继续运行应用:', e.message);
  }

  // 在macOS上，当所有窗口关闭时，通常应用程序及其菜单栏仍然保持活动状态
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口关闭时退出应用，macOS除外
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用关闭前做一些清理工作
app.on('will-quit', (event) => {
  // 这里可以进行一些清理工作
  console.log('应用即将关闭');
});

// 应用崩溃时的处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  dialog.showErrorBox('应用错误', `发生未捕获的异常: ${error.message}`);
});

// IPC事件处理
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

// 处理窗口控制事件
ipcMain.on('window-control', (_, command) => {
  if (!mainWindow) return;
  
  switch (command) {
    case 'minimize':
      mainWindow.minimize();
      break;
    case 'maximize':
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
      break;
    case 'close':
      mainWindow.close();
      break;
    case 'toggleFullScreen':
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      break;
  }
});

// 添加自动启动功能
function setAutoLaunch(enable) {
  if (process.env.NODE_ENV === 'development') return;
  
  // 仅在Windows系统下启用自动启动
  if (process.platform === 'win32') {
    try {
      const exePath = process.execPath;
      const exeName = path.basename(exePath);
      const isPortable = exeName.toLowerCase() === '咖啡及饮品商品展示系统.exe'.toLowerCase();
      
      if (isPortable) {
        console.log('检测到便携版应用，将不设置自动启动');
        return;
      }
      
      app.setLoginItemSettings({
        openAtLogin: enable,
        path: exePath,
        args: []
      });
      
      console.log(`自动启动已${enable ? '启用' : '禁用'}`);
    } catch (error) {
      console.error('设置自动启动失败:', error);
    }
  }
} 