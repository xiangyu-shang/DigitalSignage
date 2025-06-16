@echo off
chcp 65001 > nul
title 咖啡及饮品商品展示系统

echo ========================================
echo    咖啡及饮品商品展示系统 - 启动器
echo ========================================
echo.

:: 设置错误处理
setlocal EnableDelayedExpansion

:: 设置应用路径
set APPPATH=%~dp0
cd /d "%APPPATH%"

:: 启动应用
echo 正在启动应用程序...

:: 尝试启动
call "%APPPATH%startup.bat"

:: 检查是否需要显示错误
if %ERRORLEVEL% neq 0 (
    echo.
    echo 应用程序启动失败。
    echo 请查看startup.bat的执行结果。
    echo.
    echo 按任意键退出...
    pause > nul
)

exit /b
