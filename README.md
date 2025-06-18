# 咖啡及饮品商品展示系统

咖啡及饮品商品展示系统是一个基于Vue.js开发的Web应用程序，用于在数字标牌设备上展示咖啡和饮品商品。

## 技术栈

- Vue.js 3 + Pinia（状态管理）
- webpack（构建工具）
- Express（用于生产环境部署）

## 开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

这将启动开发服务器，通常在 http://localhost:8080 上访问。

### 生产构建

```bash
npm run build
```

这将在 `dist` 目录中生成生产环境的静态文件。

## 部署

### 部署到宝塔面板

1. **构建项目**

   ```bash
   npm run build
   ```

2. **将dist目录文件上传到宝塔服务器**

   将生成的 `dist` 目录中的所有文件上传到宝塔面板网站的根目录。

3. **配置网站**

   在宝塔面板中，确保您的网站配置了正确的域名和SSL证书（如需要）。

4. **配置Nginx**

   在宝塔面板的网站设置中，找到"配置文件"，添加以下伪静态规则以支持Vue Router的历史模式：

   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

5. **使用Express服务器（可选）**

   如果需要更多服务端功能，可以使用项目中的Express服务器：

   ```bash
   # 构建项目
   npm run build
   
   # 启动Express服务器
   npm run serve
   ```

   在宝塔面板中，可以使用PM2来保持服务运行：

   ```bash
   # 安装PM2（如果尚未安装）
   npm install -g pm2
   
   # 使用PM2启动服务器
   pm2 start server.js --name coffee-showcase
   ```

### 解决部署路径问题

如果您需要将应用部署到子目录（而非网站根目录），需要调整以下配置：

1. **修改webpack配置**

   在 `web.config.js` 和 `webpack.config.js` 文件中，将 `publicPath` 改为您的子目录路径：

   ```js
   output: {
     publicPath: '/your-sub-directory/',
     // ...其他配置
   }
   ```

2. **修改Vue Router**

   在 `src/renderer/router/index.js` 中，设置正确的 `base` 选项：

   ```js
   const router = createRouter({
     history: createWebHistory('/your-sub-directory/'),
     // ...其他配置
   });
   ```

3. **修改静态资源路径**

   确保HTML中的静态资源引用使用相对路径或正确的绝对路径。

## 配置

系统配置在 `web-app-config.js` 文件中，您可以根据需要修改配置项。

### 主要配置项

- **应用信息**：应用名称、版本等
- **服务器设置**：端口、主机等
- **显示设置**：标题、刷新间隔等
- **功能设置**：是否启用自动刷新、日志记录等

## 注意事项

1. 确保宝塔服务器上已安装Node.js环境（如果使用Express服务器）
2. 如果遇到跨域问题，请检查服务器的CORS设置
3. 确保服务器防火墙开放了相应的端口
