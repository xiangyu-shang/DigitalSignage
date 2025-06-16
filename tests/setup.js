/**
 * Jest测试环境设置
 */

// 模拟window.electronAPI对象
global.electronAPI = {
  getAppVersion: jest.fn(() => Promise.resolve('1.0.0')),
  windowControl: jest.fn(),
  platform: 'win32'
};

// 模拟本地存储
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// 安装本地存储模拟
global.localStorage = new LocalStorageMock();

// 模拟CSS变量
Object.defineProperty(global.window.document.documentElement, 'style', {
  value: {
    getPropertyValue: jest.fn().mockImplementation(prop => {
      const cssVars = {
        '--color-primary': '#2C3E50',
        '--color-secondary': '#3498DB',
        '--color-accent': '#E74C3C',
        '--color-background': '#ECF0F1',
        '--color-text': '#333333',
        '--font-family-base': 'Microsoft YaHei, Arial, sans-serif',
        '--font-size-default': '14px',
        '--font-size-medium': '16px',
        '--font-size-large': '18px',
        '--spacing-sm': '8px',
        '--spacing-md': '16px',
        '--spacing-lg': '24px',
        '--border-radius-sm': '4px',
        '--border-radius-md': '8px',
        '--shadow-sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        '--shadow-md': '0 4px 8px rgba(0, 0, 0, 0.1)',
      };
      return cssVars[prop] || '';
    })
  }
});

// 模拟getComputedStyle
global.getComputedStyle = jest.fn().mockImplementation(() => ({
  getPropertyValue: jest.fn(),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  flex: '1'
})); 