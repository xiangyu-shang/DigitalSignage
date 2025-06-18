/**
 * 单元测试全局设置
 */

// 设置全局变量
global.LOCAL_TESTING = true;

// 静态资源路径配置
global.__static = require('path').join(__dirname, '../public');

// 模拟localStorage
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// 模拟sessionStorage
global.sessionStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// 添加App配置
global.__APP_CONFIG__ = {
  display: {
    defaultTitle: '咖啡及饮品商品展示系统',
    refreshInterval: 60000,
    defaultLanguage: 'zh-CN'
  },
  features: {
    enableAutoRefresh: false, // 测试时禁用自动刷新
    enableLogging: true,
    showDebugInfo: true // 测试时显示调试信息
  }
};

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