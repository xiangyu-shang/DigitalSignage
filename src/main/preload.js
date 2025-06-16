const { contextBridge, ipcRenderer } = require('electron');

/**
 * 预加载脚本，用于安全地暴露部分API给渲染进程
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * 获取应用版本
   * @returns {Promise<string>} 应用版本号
   */
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  /**
   * 控制窗口操作
   * @param {string} command 命令类型：'minimize', 'maximize', 'close', 'toggleFullScreen'
   */
  windowControl: (command) => ipcRenderer.send('window-control', command),
  
  /**
   * 系统信息
   */
  platform: process.platform,
}); 