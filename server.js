/**
 * @file server.js
 * @description 用于部署咖啡及饮品商品展示系统的Express服务器
 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

// 加载配置
const appConfig = require('./web-app-config');
const PORT = process.env.PORT || appConfig.server.port || 8080;
const HOST = process.env.HOST || appConfig.server.host || '0.0.0.0';

// 创建Express应用
const app = express();

// 启用gzip压缩
app.use(compression());

// 定义日志中间件
app.use((req, res, next) => {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 静态文件中间件
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d', // 静态资源缓存1天
  setHeaders: (res, filePath) => {
    // HTML文件不缓存
    if (path.extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// 添加简单的健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// SPA路由处理 - 所有未匹配的路由都返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 创建logs目录（如果不存在）
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 启动服务器
app.listen(PORT, HOST, () => {
  console.log('='.repeat(60));
  const localIp = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`服务器启动成功! 🚀`);
  console.log(`- 本地访问: http://${localIp}:${PORT}`);
  if (HOST === '0.0.0.0') {
    console.log(`- 局域网访问: 通过本机IP地址:${PORT}`);
  }
  console.log(`- 健康检查: http://${localIp}:${PORT}/health`);
  console.log('='.repeat(60));
  
  // 将启动信息写入日志文件
  const logFile = path.join(logsDir, `server-${new Date().toISOString().replace(/:/g, '-')}.log`);
  fs.appendFileSync(logFile, `${new Date().toISOString()} - 服务器启动成功: http://${localIp}:${PORT}\n`);
});

// 处理进程终止信号
process.on('SIGINT', () => {
  console.log('服务器正在关闭...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('服务器收到终止信号，正在关闭...');
  process.exit(0);
}); 