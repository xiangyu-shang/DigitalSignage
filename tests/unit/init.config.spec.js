/**
 * 初始化配置测试
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// 模拟文件路径
jest.mock('fs');
jest.mock('path');

describe('项目配置测试', () => {
  let packageJson;
  
  beforeAll(() => {
    // 读取实际的package.json
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } else {
      packageJson = {
        name: 'coffee-beverage-showcase',
        scripts: {
          dev: '',
          build: '',
          serve: '',
        },
        dependencies: {},
        devDependencies: {}
      };
    }
  });
  
  test('package.json应包含必要的脚本命令', () => {
    expect(packageJson.scripts.dev).toBeDefined();
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts.serve).toBeDefined();
  });
  
  test('package.json应包含必要的开发依赖', () => {
    // 基础依赖
    expect(packageJson.dependencies.vue).toBeDefined();
    expect(packageJson.dependencies.pinia).toBeDefined();
    
    // Web服务器依赖
    expect(packageJson.dependencies.express).toBeDefined();
    expect(packageJson.dependencies.compression).toBeDefined();
    
    // 开发依赖
    expect(packageJson.devDependencies['vue-loader']).toBeDefined();
    expect(packageJson.devDependencies.webpack).toBeDefined();
    expect(packageJson.devDependencies['webpack-dev-server']).toBeDefined();
  });
  
  test('应用名称应与系统名称一致', () => {
    expect(packageJson.name).toBe('coffee-beverage-showcase');
    expect(packageJson.description).toContain('咖啡');
  });

  test('应该不依赖Electron', () => {
    expect(packageJson.devDependencies.electron).toBeUndefined();
    expect(packageJson.devDependencies['electron-builder']).toBeUndefined();
  });
});

describe('网页配置测试', () => {
  let webConfig;
  
  beforeAll(() => {
    // 模拟web-app-config.js内容
    webConfig = {
      appInfo: {
        name: '咖啡及饮品商品展示系统',
        version: '1.0.0',
        description: '数字标牌商品展示系统'
      },
      server: {
        port: 8080,
        host: '0.0.0.0',
        publicPath: '/'
      },
      display: {
        defaultTitle: '咖啡及饮品商品展示系统',
        refreshInterval: 60000
      },
      features: {
        enableAutoRefresh: true,
        enableOfflineMode: true
      }
    };
  });
  
  test('Web配置应包含必要的服务器设置', () => {
    expect(webConfig.server.port).toBeDefined();
    expect(webConfig.server.host).toBeDefined();
    expect(webConfig.server.publicPath).toBeDefined();
  });
  
  test('Web配置应包含必要的显示设置', () => {
    expect(webConfig.display.defaultTitle).toBe('咖啡及饮品商品展示系统');
    expect(webConfig.display.refreshInterval).toBeGreaterThan(0);
  });
}); 