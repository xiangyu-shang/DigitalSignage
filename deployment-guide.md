# 咖啡及饮品商品展示系统 - Web部署指南

本文档提供将"咖啡及饮品商品展示系统"作为网页应用部署到Linux服务器的完整步骤。

## 目录

1. [系统架构概述](#系统架构概述)
2. [环境要求](#环境要求)
3. [部署方式选择](#部署方式选择)
4. [方式一：Node.js服务器部署](#方式一nodejs服务器部署)
5. [方式二：Nginx静态资源部署](#方式二nginx静态资源部署)
6. [性能优化](#性能优化)
7. [安全配置](#安全配置)
8. [故障排除](#故障排除)
9. [日常维护](#日常维护)

## 系统架构概述

咖啡及饮品商品展示系统是一个基于Vue.js的单页应用(SPA)，现已调整为纯网页应用。系统主要组件包括：

- **前端框架**: Vue.js 3.x
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **构建工具**: Webpack 5

系统架构简化为两种部署方式：
1. 使用Node.js的Express服务器
2. 纯静态资源部署(Nginx/Apache)

## 环境要求

### 基本要求

- Linux服务器(推荐Ubuntu 20.04 LTS或更高版本)
- Node.js 16.x+(用于构建和方式一部署)
- Nginx 1.18+(用于方式二部署)
- Git(用于获取源代码)

### 服务器配置建议

- CPU: 1核以上
- 内存: 1GB以上
- 磁盘: 10GB以上
- 带宽: 1Mbps以上

## 部署方式选择

根据您的需求和环境选择合适的部署方式：

| 部署方式 | 优点 | 缺点 | 适用场景 |
|---------|------|------|---------|
| Node.js服务器 | 易于开发和调试；支持API接口 | 资源消耗较高 | 开发环境；需要后端API支持 |
| Nginx静态部署 | 性能高；资源消耗低 | 不支持服务端渲染 | 生产环境；纯前端展示 |

## 方式一：Node.js服务器部署

### 1. 准备环境

```bash
# 更新系统包
sudo apt update
sudo apt upgrade -y

# 安装Node.js和npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v  # 应显示v16.x.x
npm -v   # 应显示8.x.x

# 安装Git
sudo apt install -y git
```

### 2. 获取代码

```bash
# 克隆代码仓库
git clone [项目仓库URL] coffee-showcase
cd coffee-showcase

# 或者直接复制代码到服务器
mkdir -p ~/coffee-showcase
# 然后将代码复制到此目录
cd ~/coffee-showcase
```

### 3. 安装依赖并构建

```bash
# 复制并重命名为标准package.json
cp package-web.json package.json

# 安装依赖
npm install

# 构建项目
npm run build
```

### 4. 配置应用

编辑`web-app-config.js`，根据需要调整配置：

```js
module.exports = {
  // 应用信息
  appInfo: {
    name: '咖啡及饮品商品展示系统',
    version: '1.0.0',
    description: '数字标牌商品展示系统'
  },
  
  // 服务器配置
  server: {
    port: 8088,  // 修改为您想使用的端口
    host: '0.0.0.0',
    publicPath: '/',
    apiBaseUrl: '/api'
  },
  
  // 其他配置...
}
```

### 5. 启动服务器

```bash
# 直接启动
node server.js

# 或者使用PM2进行进程管理(推荐)
npm install -g pm2
pm2 start server.js --name "coffee-showcase" --time
pm2 save
pm2 startup
```

### 6. 设置防火墙

```bash
# 开放应用端口
sudo ufw allow 8088/tcp

# 如果使用标准HTTP端口
sudo ufw allow 80/tcp
```

### 7. 设置反向代理（可选）

如果您希望使用标准HTTP端口(80)，可以使用Nginx作为反向代理：

```bash
# 安装Nginx
sudo apt install -y nginx

# 创建配置文件
sudo nano /etc/nginx/conf.d/coffee-showcase.conf
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 更改为您的域名
    
    location / {
        proxy_pass http://localhost:8088;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

然后：

```bash
# 测试Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## 方式二：Nginx静态资源部署

### 1. 准备环境

```bash
# 更新系统包
sudo apt update
sudo apt upgrade -y

# 安装Nginx
sudo apt install -y nginx

# 安装Node.js和npm (用于构建)
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# 安装Git
sudo apt install -y git
```

### 2. 获取代码并构建

```bash
# 获取代码
git clone [项目仓库URL] coffee-showcase
cd coffee-showcase

# 复制并重命名为标准package.json
cp package-web.json package.json

# 安装依赖
npm install

# 构建项目
npm run build
```

### 3. 配置Nginx

```bash
# 创建网站目录
sudo mkdir -p /var/www/coffee-showcase

# 复制构建好的文件
sudo cp -R dist/* /var/www/coffee-showcase/

# 创建Nginx配置文件
sudo nano /etc/nginx/conf.d/coffee-showcase.conf
```

添加以下内容（或使用项目中的nginx.conf文件内容）：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 修改为您的域名或IP
    
    root /var/www/coffee-showcase;
    index index.html;
    
    # 启用gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
    
    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 7d;
    }
    
    # 处理SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

然后：

```bash
# 测试Nginx配置
sudo nginx -t

# 应用配置
sudo systemctl restart nginx

# 确保Nginx开机自启
sudo systemctl enable nginx
```

### 4. 设置权限

```bash
# 设置适当的权限
sudo chown -R www-data:www-data /var/www/coffee-showcase
sudo chmod -R 755 /var/www/coffee-showcase
```

## 性能优化

### 启用浏览器缓存

Nginx配置中已包含基本的缓存设置，但您可以根据需要进一步调整：

```nginx
# 在Nginx配置中添加或修改
location ~* \.(jpg|jpeg|png|gif|ico)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
}

location ~* \.(css|js)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
}
```

### 启用HTTP/2

```nginx
server {
    listen 443 ssl http2;
    # SSL配置...
    
    # 其他配置...
}
```

### 定期清理日志

```bash
# 创建日志轮转配置
sudo nano /etc/logrotate.d/coffee-showcase

# 添加以下内容
/var/log/nginx/coffee-showcase-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -s /run/nginx.pid ] && kill -USR1 `cat /run/nginx.pid`
    endscript
}
```

## 安全配置

### 配置HTTPS

```bash
# 安装Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo systemctl status certbot.timer
```

### 添加安全响应头

```nginx
# 在Nginx配置中添加
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

## 故障排除

### 常见问题

1. **页面显示空白**
   - 检查浏览器控制台是否有错误
   - 验证`dist`目录中是否包含所有必要文件
   - 确认Nginx配置中的路径正确

2. **样式或图片加载失败**
   - 检查网络请求是否404
   - 验证`publicPath`配置是否正确
   - 检查Nginx配置中的路径和权限

3. **无法路由到子页面**
   - 确认Nginx配置中包含`try_files $uri $uri/ /index.html;`
   - 检查Vue Router配置

### 查看日志

```bash
# Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 应用特定日志
sudo tail -f /var/log/nginx/coffee-showcase-error.log

# 如果使用PM2
pm2 logs coffee-showcase
```

## 日常维护

### 更新应用

```bash
# 进入应用目录
cd ~/coffee-showcase

# 拉取最新代码
git pull

# 安装依赖
npm install

# 重新构建
npm run build

# 部署新版本
sudo cp -R dist/* /var/www/coffee-showcase/

# 如果使用PM2
pm2 restart coffee-showcase
```

### 监控服务器状态

```bash
# 安装监控工具
sudo apt install -y htop

# 查看系统资源
htop

# 查看Nginx状态
systemctl status nginx
```

### 备份配置

```bash
# 备份Nginx配置
sudo cp /etc/nginx/conf.d/coffee-showcase.conf /backup/

# 备份应用配置
cp web-app-config.js /backup/
```

## 总结

通过以上步骤，您已经成功将咖啡及饮品商品展示系统部署为网页应用。根据您的需求，选择了Node.js服务器或Nginx静态资源部署方式。这两种方式各有优缺点，但都能为用户提供良好的体验。

如遇到任何问题，请参考故障排除部分或联系技术支持。 