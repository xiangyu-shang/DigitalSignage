@echo off
chcp 65001 > nul
title 咖啡及饮品商品展示系统 - 构建问题修复工具

echo ================================================
echo     咖啡及饮品商品展示系统 - 构建问题修复工具
echo ================================================
echo.

set APPPATH=%~dp0
cd /d "%APPPATH%"

echo 正在检查环境...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未检测到Node.js环境，请先安装Node.js
    pause
    exit /b 1
)

echo.
echo 选择修复操作:
echo 1. 清理并重新安装依赖
echo 2. 修复Electron下载问题
echo 3. 清理构建缓存
echo 4. 全面修复(执行所有操作)
echo.

set /p fixType=请选择修复类型(1-4): 

if "%fixType%"=="1" goto :CleanDeps
if "%fixType%"=="2" goto :FixElectron
if "%fixType%"=="3" goto :CleanCache
if "%fixType%"=="4" goto :FixAll

echo 输入错误，请重新运行脚本选择。
pause
exit /b 1

:FixAll
echo 正在执行全面修复...
call :CleanDeps
call :FixElectron
call :CleanCache
goto :END

:CleanDeps
echo.
echo 步骤1: 清理并重新安装依赖
echo -------------------------------
echo 正在删除node_modules文件夹...
if exist "%APPPATH%node_modules" (
    rmdir /s /q "%APPPATH%node_modules"
)

echo 正在删除package-lock.json...
if exist "%APPPATH%package-lock.json" (
    del /f /q "%APPPATH%package-lock.json"
)

echo 正在重新安装依赖...
call npm install
if %ERRORLEVEL% neq 0 (
    echo 依赖安装失败，请检查网络连接后重试。
    pause
    exit /b 1
)
echo 依赖重新安装完成！
if "%fixType%"=="1" goto :END
exit /b 0

:FixElectron
echo.
echo 步骤2: 修复Electron下载问题
echo -------------------------------
echo 设置Electron镜像源为淘宝镜像...

:: 设置Electron镜像
call npm config set ELECTRON_MIRROR https://npm.taobao.org/mirrors/electron/
call npm config set ELECTRON_BUILDER_BINARIES_MIRROR https://npm.taobao.org/mirrors/electron-builder-binaries/

echo 尝试重新安装Electron...
call npm uninstall electron electron-builder
call npm install electron electron-builder --save-dev

if %ERRORLEVEL% neq 0 (
    echo Electron重新安装失败，请检查网络连接后重试。
    pause
    exit /b 1
)
echo Electron修复完成！
if "%fixType%"=="2" goto :END
exit /b 0

:CleanCache
echo.
echo 步骤3: 清理构建缓存
echo -------------------------------
echo 正在清理dist目录...
if exist "%APPPATH%dist" (
    rmdir /s /q "%APPPATH%dist"
)

echo 正在清理release目录...
if exist "%APPPATH%release" (
    rmdir /s /q "%APPPATH%release"
)

echo 正在清理.cache目录...
if exist "%APPPATH%.cache" (
    rmdir /s /q "%APPPATH%.cache"
)

echo 正在清理electron-builder缓存...
call npx electron-builder cache clear
echo 缓存清理完成！
if "%fixType%"=="3" goto :END
exit /b 0

:END
echo.
echo 修复操作已完成！请尝试重新构建应用。
echo 建议使用build-app.bat脚本重新构建应用。
echo.
pause 