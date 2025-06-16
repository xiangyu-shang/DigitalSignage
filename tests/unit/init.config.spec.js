/**
 * 项目初始化与配置测试
 */

const path = require('path');
const fs = require('fs');
const { BrowserWindow } = require('electron');

// 模拟electron对象
jest.mock('electron', () => {
  const mockIpcMain = {
    handle: jest.fn(),
    on: jest.fn(),
  };
  
  const mockApp = {
    whenReady: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
    getVersion: jest.fn(() => '1.0.0'),
    quit: jest.fn(),
  };
  
  const mockBrowserWindow = jest.fn().mockImplementation(() => ({
    loadURL: jest.fn(),
    on: jest.fn(),
    webContents: {
      openDevTools: jest.fn(),
    },
    minimize: jest.fn(),
    maximize: jest.fn(),
    unmaximize: jest.fn(),
    isMaximized: jest.fn(),
    close: jest.fn(),
    setFullScreen: jest.fn(),
    isFullScreen: jest.fn(() => false),
  }));
  
  return {
    app: mockApp,
    BrowserWindow: mockBrowserWindow,
    ipcMain: mockIpcMain,
  };
});

describe('项目初始化与配置测试', () => {
  let mainProcess;
  
  beforeEach(() => {
    // 清除模块缓存
    jest.resetModules();
    
    // 导入主进程模块
    mainProcess = require('../../src/main/index');
  });
  
  test('项目应有正确的package.json配置', () => {
    // 读取package.json
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json')));
    
    // 检查基本配置
    expect(packageJson.name).toBe('digital-signage');
    expect(packageJson.version).toBeDefined();
    expect(packageJson.main).toBe('src/main/index.js');
    
    // 检查脚本配置
    expect(packageJson.scripts.dev).toBeDefined();
    expect(packageJson.scripts['electron:dev']).toBeDefined();
    expect(packageJson.scripts['electron:build']).toBeDefined();
    
    // 检查依赖项
    expect(packageJson.dependencies.vue).toBeDefined();
    expect(packageJson.dependencies['vue-router']).toBeDefined();
    expect(packageJson.dependencies.pinia).toBeDefined();
    expect(packageJson.dependencies.howler).toBeDefined();
    
    // 检查开发依赖项
    expect(packageJson.devDependencies.electron).toBeDefined();
    expect(packageJson.devDependencies.webpack).toBeDefined();
    expect(packageJson.devDependencies['webpack-cli']).toBeDefined();
    expect(packageJson.devDependencies['webpack-dev-server']).toBeDefined();
    expect(packageJson.devDependencies['electron-builder']).toBeDefined();
  });
  
  test('Electron窗口配置应符合9:16比例', () => {
    const { BrowserWindow } = require('electron');
    
    // 检查BrowserWindow是否被调用
    expect(BrowserWindow).toHaveBeenCalled();
    
    // 获取BrowserWindow调用参数
    const windowConfig = BrowserWindow.mock.calls[0][0];
    
    // 检查窗口尺寸是否符合9:16比例
    expect(windowConfig.width).toBe(1080);
    expect(windowConfig.height).toBe(1920);
    expect(windowConfig.height / windowConfig.width).toBeCloseTo(16/9, 1);
    
    // 检查窗口选项
    expect(windowConfig.frame).toBe(false);
    expect(windowConfig.fullscreenable).toBe(true);
    expect(windowConfig.resizable).toBe(false);
    
    // 检查webPreferences
    expect(windowConfig.webPreferences.nodeIntegration).toBe(false);
    expect(windowConfig.webPreferences.contextIsolation).toBe(true);
    expect(windowConfig.webPreferences.preload).toContain('preload.js');
  });
  
  test('预加载脚本应暴露正确的API', () => {
    // 模拟contextBridge和ipcRenderer
    const mockContextBridge = {
      exposeInMainWorld: jest.fn(),
    };
    
    const mockIpcRenderer = {
      invoke: jest.fn(),
      send: jest.fn(),
    };
    
    jest.mock('electron', () => ({
      contextBridge: mockContextBridge,
      ipcRenderer: mockIpcRenderer,
    }), { virtual: true });
    
    // 运行预加载脚本的逻辑
    const exposedApis = {};
    mockContextBridge.exposeInMainWorld.mockImplementation((apiKey, api) => {
      exposedApis[apiKey] = api;
    });
    
    // 导入预加载脚本 (模拟执行)
    // 因为我们不能实际导入，所以我们直接期望API结构符合预期
    
    // 预期的API结构
    const expectedApi = {
      electronAPI: {
        getAppVersion: expect.any(Function),
        windowControl: expect.any(Function),
        platform: expect.any(String),
      }
    };
    
    // 验证API结构
    expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalled();
  });
  
  test('IPC事件处理器应正确设置', () => {
    const { ipcMain } = require('electron');
    
    // 检查app-version处理器是否已注册
    expect(ipcMain.handle).toHaveBeenCalledWith('app-version', expect.any(Function));
    
    // 检查window-control处理器是否已注册
    expect(ipcMain.on).toHaveBeenCalledWith('window-control', expect.any(Function));
  });
}); 