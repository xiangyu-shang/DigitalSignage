#!/bin/bash

# 咖啡及饮品商品展示系统 - Linux构建打包脚本
# 此脚本用于在Linux系统上构建和打包应用程序

# 设置应用程序路径
APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$APP_DIR"

# 创建日志目录
mkdir -p logs
LOG_FILE="logs/build-$(date +%Y%m%d-%H%M%S).log"

# 输出基本信息
echo "====================================================" | tee -a "$LOG_FILE"
echo "咖啡及饮品商品展示系统 - 构建打包脚本" | tee -a "$LOG_FILE"
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
  rm -rf node_modules dist release 2>&1 | tee -a "$LOG_FILE"
  
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

# 检查构建依赖
echo "正在检查构建依赖..." | tee -a "$LOG_FILE"

# 检查fakeroot
if ! command -v fakeroot >/dev/null 2>&1; then
    echo "警告: 未检测到fakeroot，正在安装..." | tee -a "$LOG_FILE"
    
    # 检测Linux发行版
    if command -v apt-get >/dev/null 2>&1; then
        # Debian/Ubuntu
        sudo apt-get update
        sudo apt-get install -y fakeroot dpkg rpm 2>&1 | tee -a "$LOG_FILE"
    elif command -v dnf >/dev/null 2>&1; then
        # Fedora
        sudo dnf install -y fakeroot rpm-build 2>&1 | tee -a "$LOG_FILE"
    elif command -v yum >/dev/null 2>&1; then
        # CentOS/RHEL
        sudo yum install -y fakeroot rpm-build 2>&1 | tee -a "$LOG_FILE"
    elif command -v pacman >/dev/null 2>&1; then
        # Arch Linux
        sudo pacman -S --noconfirm fakeroot 2>&1 | tee -a "$LOG_FILE"
    else
        echo "警告: 无法自动安装fakeroot，请手动安装后继续" | tee -a "$LOG_FILE"
    fi
fi

# 设置npm镜像源以加速下载
echo "正在设置npm镜像源..." | tee -a "$LOG_FILE"
npm config set registry https://registry.npmmirror.com/ 2>&1 | tee -a "$LOG_FILE"
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/ 2>&1 | tee -a "$LOG_FILE"

# 安装依赖
echo "正在安装项目依赖..." | tee -a "$LOG_FILE"
npm install 2>&1 | tee -a "$LOG_FILE"

# 修改package.json，添加Linux打包配置
echo "正在检查package.json配置..." | tee -a "$LOG_FILE"

# 检查是否已经有build配置
HAS_BUILD_CONFIG=$(grep -c '"build"' package.json || true)

if [ "$HAS_BUILD_CONFIG" -eq 0 ]; then
    echo "正在添加Linux打包配置..." | tee -a "$LOG_FILE"
    
    # 创建临时文件
    TMP_FILE=$(mktemp)
    
    # 添加构建配置
    jq '. + {"build": {"appId": "com.digitalsignage.app", "productName": "咖啡及饮品商品展示系统", "directories": {"output": "release"}, "linux": {"target": ["AppImage", "deb"], "category": "Office", "icon": "public/icon.png"}}}' package.json > "$TMP_FILE"
    
    # 如果jq命令成功，则更新package.json
    if [ $? -eq 0 ]; then
        mv "$TMP_FILE" package.json
    else
        echo "警告: 无法自动添加构建配置，请手动修改package.json文件" | tee -a "$LOG_FILE"
        rm -f "$TMP_FILE"
    fi
else
    echo "已检测到构建配置，跳过配置修改" | tee -a "$LOG_FILE"
fi

# 检查是否有icon.png
if [ ! -f "public/icon.png" ]; then
    echo "警告: 未检测到应用图标文件(public/icon.png)，创建临时图标..." | tee -a "$LOG_FILE"
    
    # 创建public目录（如果不存在）
    mkdir -p public
    
    # 创建一个简单的临时图标（如果不存在）
    if [ ! -f "public/icon.png" ]; then
        # 尝试从其他图标文件转换
        if [ -f "public/icon.ico" ]; then
            echo "正在从icon.ico转换图标..." | tee -a "$LOG_FILE"
            if command -v convert >/dev/null 2>&1; then
                convert public/icon.ico public/icon.png 2>&1 | tee -a "$LOG_FILE"
            else
                echo "警告: 未检测到ImageMagick，无法转换图标" | tee -a "$LOG_FILE"
            fi
        else
            echo "创建默认图标..." | tee -a "$LOG_FILE"
            # 创建一个1024x1024的临时图标
            if command -v convert >/dev/null 2>&1; then
                convert -size 1024x1024 xc:#8B4513 -gravity center -pointsize 200 -fill white -annotate 0 "咖啡" public/icon.png 2>&1 | tee -a "$LOG_FILE"
            else
                echo "警告: 未检测到ImageMagick，无法创建默认图标" | tee -a "$LOG_FILE"
            fi
        fi
    fi
fi

# 构建前端资源
echo "正在构建前端资源..." | tee -a "$LOG_FILE"
NODE_ENV=production npm run build 2>&1 | tee -a "$LOG_FILE"

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "错误: 前端资源构建失败，未生成dist目录" | tee -a "$LOG_FILE"
    exit 1
fi

# 打包应用
echo "正在打包应用..." | tee -a "$LOG_FILE"
NODE_ENV=production npm run electron:build 2>&1 | tee -a "$LOG_FILE"

# 检查release目录是否存在
if [ ! -d "release" ]; then
    echo "错误: 应用打包失败，未生成release目录" | tee -a "$LOG_FILE"
    exit 1
fi

# 显示打包结果
echo "====================================================" | tee -a "$LOG_FILE"
echo "打包完成，生成的文件:" | tee -a "$LOG_FILE"
find release -type f -name "*.AppImage" -o -name "*.deb" | tee -a "$LOG_FILE"
echo "====================================================" | tee -a "$LOG_FILE"

# 创建启动脚本的软链接
echo "正在创建启动脚本软链接..." | tee -a "$LOG_FILE"
if [ -f "linux-start.sh" ]; then
    chmod +x linux-start.sh
    
    # 找到第一个AppImage文件
    APPIMAGE=$(find release -type f -name "*.AppImage" | head -n 1)
    
    if [ -n "$APPIMAGE" ]; then
        echo "将linux-start.sh复制到release目录..." | tee -a "$LOG_FILE"
        cp linux-start.sh release/
        chmod +x release/linux-start.sh
    fi
    
    echo "启动脚本已准备就绪" | tee -a "$LOG_FILE"
else
    echo "警告: 未找到linux-start.sh启动脚本" | tee -a "$LOG_FILE"
fi

# 输出结束信息
echo "====================================================" | tee -a "$LOG_FILE"
echo "构建打包完成" | tee -a "$LOG_FILE"
echo "结束时间: $(date)" | tee -a "$LOG_FILE"
echo "生成的文件位于release目录" | tee -a "$LOG_FILE"
echo "====================================================" | tee -a "$LOG_FILE"

# 显示使用说明
echo "使用方法:"
echo "1. 安装DEB包:"
echo "   sudo dpkg -i release/咖啡及饮品商品展示系统-*.deb"
echo "   sudo apt-get install -f"
echo ""
echo "2. 直接运行AppImage:"
echo "   chmod +x release/咖啡及饮品商品展示系统-*.AppImage"
echo "   ./release/咖啡及饮品商品展示系统-*.AppImage"
echo ""
echo "3. 使用启动脚本运行:"
echo "   chmod +x release/linux-start.sh"
echo "   ./release/linux-start.sh"
echo ""

exit 0 