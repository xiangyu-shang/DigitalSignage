#!/bin/bash

# 咖啡及饮品商品展示系统 - Web应用构建脚本
# 此脚本用于构建网页版应用

# 设置应用程序路径
APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$APP_DIR"

# 创建日志目录
mkdir -p logs
LOG_FILE="logs/web-build-$(date +%Y%m%d-%H%M%S).log"

# 输出基本信息
echo "====================================================" | tee -a "$LOG_FILE"
echo "咖啡及饮品商品展示系统 - Web应用构建脚本" | tee -a "$LOG_FILE"
echo "启动时间: $(date)" | tee -a "$LOG_FILE"
echo "工作目录: $APP_DIR" | tee -a "$LOG_FILE"
echo "====================================================" | tee -a "$LOG_FILE"

# 检查是否有 --clean 参数
CLEAN=false
for arg in "$@"; do
  if [ "$arg" == "--clean" ]; then
    CLEAN=true
  fi
done

# 如果指定了 --clean 参数，则清理项目
if [ "$CLEAN" = true ]; then
  echo "正在清理项目..." | tee -a "$LOG_FILE"
  rm -rf node_modules dist 2>&1 | tee -a "$LOG_FILE"
  
  # 清理npm缓存
  echo "正在清理NPM缓存..." | tee -a "$LOG_FILE"
  npm cache clean --force 2>&1 | tee -a "$LOG_FILE"
fi

# 检查Node.js环境
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v)
    echo "检测到Node.js版本: $NODE_VERSION" | tee -a "$LOG_FILE"
else
    echo "错误: 未检测到Node.js环境，请先安装Node.js" | tee -a "$LOG_FILE"
    exit 1
fi

# 设置npm镜像源以加速下载
echo "正在设置npm镜像源..." | tee -a "$LOG_FILE"
npm config set registry https://registry.npmmirror.com/ 2>&1 | tee -a "$LOG_FILE"

# 检查package.json文件
if [ ! -f "package.json" ] && [ -f "package-web.json" ]; then
    echo "未找到package.json，但存在package-web.json，正在复制..." | tee -a "$LOG_FILE"
    cp package-web.json package.json
fi

if [ ! -f "package.json" ]; then
    echo "错误: 未找到package.json文件，无法继续构建" | tee -a "$LOG_FILE"
    exit 1
fi

# 安装依赖
echo "正在安装项目依赖..." | tee -a "$LOG_FILE"
npm install 2>&1 | tee -a "$LOG_FILE"

# 检查web.config.js是否存在
if [ ! -f "web.config.js" ]; then
    echo "警告: 未找到web.config.js文件，将使用默认webpack配置" | tee -a "$LOG_FILE"
fi

# 构建项目
echo "正在构建项目..." | tee -a "$LOG_FILE"
if [ -f "web.config.js" ]; then
    echo "使用web.config.js构建..." | tee -a "$LOG_FILE"
    NODE_ENV=production npx webpack --config web.config.js 2>&1 | tee -a "$LOG_FILE"
else
    echo "使用默认配置构建..." | tee -a "$LOG_FILE"
    npm run build 2>&1 | tee -a "$LOG_FILE"
fi

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "错误: 构建失败，未生成dist目录" | tee -a "$LOG_FILE"
    exit 1
fi

# 生成版本信息文件
echo "正在生成版本信息..." | tee -a "$LOG_FILE"
VERSION=$(node -p "require('./package.json').version || '1.0.0'")
BUILD_TIME=$(date +"%Y-%m-%d %H:%M:%S")

cat > dist/version.json << EOL
{
  "version": "${VERSION}",
  "buildTime": "${BUILD_TIME}",
  "buildHost": "$(hostname)",
  "nodeVersion": "${NODE_VERSION}"
}
EOL

echo "版本信息已写入dist/version.json" | tee -a "$LOG_FILE"

# 复制服务器文件
if [ -f "server.js" ]; then
    echo "正在复制server.js到dist目录..." | tee -a "$LOG_FILE"
    cp server.js dist/
fi

if [ -f "web-app-config.js" ]; then
    echo "正在复制web-app-config.js到dist目录..." | tee -a "$LOG_FILE"
    cp web-app-config.js dist/
fi

# 创建启动脚本
cat > dist/start-web.sh << 'EOL'
#!/bin/bash

# 设置工作目录
CD_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$CD_DIR"

# 创建日志目录
mkdir -p logs

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 如果有server.js，则启动服务器
if [ -f "server.js" ]; then
    echo "正在启动Web服务器..."
    # 设置端口（如果提供）
    PORT=${1:-8080}
    node server.js $PORT
else
    echo "错误: 未找到server.js文件，无法启动服务器"
    echo "提示: 可以使用以下命令通过npx启动简易服务器:"
    echo "      npx serve -s ."
    
    # 尝试使用npx serve启动
    if command -v npx &> /dev/null; then
        echo "正在使用npx serve启动简易服务器..."
        npx serve -s .
    fi
fi
EOL

# 设置执行权限
chmod +x dist/start-web.sh

echo "====================================================" | tee -a "$LOG_FILE"
echo "构建完成！" | tee -a "$LOG_FILE"
echo "构建输出目录: $APP_DIR/dist" | tee -a "$LOG_FILE"
echo "运行方式: ./dist/start-web.sh [port]" | tee -a "$LOG_FILE"
echo "结束时间: $(date)" | tee -a "$LOG_FILE"
echo "====================================================" | tee -a "$LOG_FILE"

# 显示使用说明
echo "使用方法:"
echo "1. 直接运行Web服务器:"
echo "   cd dist"
echo "   ./start-web.sh [端口号]"
echo ""
echo "2. 或将dist目录部署到Web服务器上"
echo "   例如Nginx或Apache"
echo ""
echo "3. 如需要修改服务器配置，请编辑dist/web-app-config.js文件"
echo ""

exit 0 