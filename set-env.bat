@echo off
echo 设置Electron环境变量...

set ELECTRON_DISABLE_GPU=1
set ELECTRON_NO_ASAR=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_DISABLE_SECURITY_WARNINGS=1
set LANG=zh_CN.UTF-8
set LC_ALL=zh_CN.UTF-8
set LC_CTYPE=zh_CN.UTF-8

echo 环境变量设置完成，可以启动应用
