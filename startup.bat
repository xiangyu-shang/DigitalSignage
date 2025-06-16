@echo off
chcp 65001 > nul
title 咖啡及饮品商品展示系统 - 极简启动器

echo ========================================
echo    咖啡及饮品商品展示系统 - 极简启动器
echo ========================================
echo.
echo 正在启动...请稍候...

:: 设置错误处理
setlocal EnableDelayedExpansion

:: 设置应用路径
set APPPATH=%~dp0
cd /d "%APPPATH%"

:: 检查应用程序路径
echo 检查应用程序路径...

:: 尝试所有可能的路径，按优先级排序
set FOUND=0

:: 1. 检查便携版
if exist "%APPPATH%release\咖啡及饮品商品展示系统.exe" (
    echo 找到便携版应用...
    start "" "%APPPATH%release\咖啡及饮品商品展示系统.exe"
    set FOUND=1
    goto :APP_FOUND
)

:: 2. 检查标准安装包构建输出
if exist "%APPPATH%release\win-unpacked\咖啡及饮品商品展示系统.exe" (
    echo 找到标准版应用...
    start "" "%APPPATH%release\win-unpacked\咖啡及饮品商品展示系统.exe"
    set FOUND=1
    goto :APP_FOUND
)

:: 3. 检查安装包
if exist "%APPPATH%release\咖啡及饮品商品展示系统 Setup.exe" (
    echo 找到安装程序...
    start "" "%APPPATH%release\咖啡及饮品商品展示系统 Setup.exe"
    set FOUND=1
    goto :APP_FOUND
)

:: 4. 检查其他可能的路径
if exist "%APPPATH%dist\win-unpacked\咖啡及饮品商品展示系统.exe" (
    echo 找到其他版本应用...
    start "" "%APPPATH%dist\win-unpacked\咖啡及饮品商品展示系统.exe"
    set FOUND=1
    goto :APP_FOUND
)

:APP_FOUND
if %FOUND%==1 (
    echo 应用程序已启动！
    timeout /t 2 > nul
    exit /b 0
) else (
    echo.
    echo 无法找到应用程序！
    echo 请先运行"build-app.bat"构建应用程序。
    echo.
    echo 按任意键运行构建工具...
    pause > nul
    call "%APPPATH%build-app.bat"
    exit /b 1
) 