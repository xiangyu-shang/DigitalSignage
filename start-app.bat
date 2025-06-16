@echo off
chcp 65001 > nul
title 咖啡及饮品商品展示系统启动器

echo ================================================
echo         咖啡及饮品商品展示系统 - 启动器
echo ================================================
echo.
echo  正在检查环境并启动应用...
echo.

:: 设置错误处理
setlocal EnableDelayedExpansion

:: 创建日志目录
if not exist "logs" mkdir logs

:: 设置日志文件
set LOG_FILE=logs\app-log-%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%.txt
set LOG_FILE=%LOG_FILE: =0%
echo 启动日志 - %date% %time% > %LOG_FILE%

set APPPATH=%~dp0
cd /d "%APPPATH%"

:: 检查各种可能的应用程序路径
echo 正在检查可能的应用程序位置...
echo 检查可能的应用程序位置... >> %LOG_FILE%

:: 检查标准构建输出路径
echo 检查路径: %APPPATH%release\win-unpacked\咖啡及饮品商品展示系统.exe >> %LOG_FILE%
if exist "%APPPATH%release\win-unpacked\咖啡及饮品商品展示系统.exe" (
    echo 找到已构建的应用程序，正在启动...
    echo 找到: %APPPATH%release\win-unpacked\咖啡及饮品商品展示系统.exe >> %LOG_FILE%
    start "" "%APPPATH%release\win-unpacked\咖啡及饮品商品展示系统.exe"
    echo 应用程序已启动！
    goto :SUCCESS_EXIT
)

:: 检查常规的Electron构建输出路径
echo 检查路径: %APPPATH%dist\win-unpacked\咖啡及饮品商品展示系统.exe >> %LOG_FILE%
if exist "%APPPATH%dist\win-unpacked\咖啡及饮品商品展示系统.exe" (
    echo 找到已构建的应用程序，正在启动...
    echo 找到: %APPPATH%dist\win-unpacked\咖啡及饮品商品展示系统.exe >> %LOG_FILE%
    start "" "%APPPATH%dist\win-unpacked\咖啡及饮品商品展示系统.exe"
    echo 应用程序已启动！
    goto :SUCCESS_EXIT
)

:: 检查可能的便携版路径
echo 检查路径: %APPPATH%release\咖啡及饮品商品展示系统.exe >> %LOG_FILE%
if exist "%APPPATH%release\咖啡及饮品商品展示系统.exe" (
    echo 找到便携版应用程序，正在启动...
    echo 找到: %APPPATH%release\咖啡及饮品商品展示系统.exe >> %LOG_FILE%
    start "" "%APPPATH%release\咖啡及饮品商品展示系统.exe"
    echo 应用程序已启动！
    goto :SUCCESS_EXIT
)

:: 检查安装包路径
echo 检查路径: %APPPATH%release\咖啡及饮品商品展示系统 Setup.exe >> %LOG_FILE%
if exist "%APPPATH%release\咖啡及饮品商品展示系统 Setup.exe" (
    echo 找到安装程序，正在启动...
    echo 找到: %APPPATH%release\咖啡及饮品商品展示系统 Setup.exe >> %LOG_FILE%
    start "" "%APPPATH%release\咖啡及饮品商品展示系统 Setup.exe"
    echo 安装程序已启动！
    goto :SUCCESS_EXIT
)

:: 如果没有构建版本，询问用户是否要构建
echo 未找到已构建的应用程序。 >> %LOG_FILE%
echo 未找到已构建的应用程序。
echo.
echo 您可以选择:
echo 1. 启动开发环境（需要Node.js）
echo 2. 构建应用程序（需要Node.js）
echo.
set /p choice=请选择操作(1-2，默认1): 
echo 用户选择: %choice% >> %LOG_FILE%

if "%choice%"=="2" (
    echo 正在启动构建工具...
    echo 正在启动构建工具... >> %LOG_FILE%
    call "%APPPATH%build-app.bat"
    goto :END
)

:: 默认启动开发环境
echo 正在尝试启动开发环境...
echo 正在尝试启动开发环境... >> %LOG_FILE%

:: 如果没有构建版本，则启动开发版本
if exist "%APPPATH%node_modules" (
    echo 开发环境依赖已存在，正在启动开发环境...
    echo 开发环境依赖已存在，正在启动开发环境... >> %LOG_FILE%

    :: 设置开发环境变量
    set NODE_ENV=development
    set ELECTRON_DISABLE_GPU=1
    set ELECTRON_DISABLE_SECURITY_WARNINGS=1
    set ELECTRON_NO_ASAR=1

    :: 启动开发服务器
    echo 正在启动webpack开发服务器... >> %LOG_FILE%
    start /b cmd /c "npx webpack serve --config webpack.config.js" >> %LOG_FILE% 2>&1

    :: 等待webpack开发服务器启动
    echo 正在等待开发服务器启动...
    echo 正在等待开发服务器启动... >> %LOG_FILE%
    timeout /t 5 /nobreak > nul

    :: 启动Electron应用
    echo 正在启动Electron应用...
    echo 正在启动Electron应用... >> %LOG_FILE%
    call npx electron --disable-gpu --disable-software-rasterizer --disable-gpu-compositing --disable-gpu-rasterization --disable-gpu-sandbox --no-sandbox . >> %LOG_FILE% 2>&1
    
    :: 检查启动是否成功
    if %ERRORLEVEL% neq 0 (
        echo Electron应用启动失败，请检查错误信息。
        echo Electron应用启动失败，错误代码: %ERRORLEVEL% >> %LOG_FILE%
        goto :ERROR_EXIT
    )
) else (
    echo 首次运行，正在安装依赖...
    echo 首次运行，正在安装依赖... >> %LOG_FILE%
    call npm install >> %LOG_FILE% 2>&1
    if %ERRORLEVEL% neq 0 (
        echo 安装依赖失败，请检查网络连接后重试。
        echo 安装依赖失败，请检查错误信息。 >> %LOG_FILE%
        goto :ERROR_EXIT
    )
    
    echo 依赖安装完成，正在启动开发环境...
    echo 依赖安装完成，正在启动开发环境... >> %LOG_FILE%

    :: 设置开发环境变量
    set NODE_ENV=development
    set ELECTRON_DISABLE_GPU=1
    set ELECTRON_DISABLE_SECURITY_WARNINGS=1
    set ELECTRON_NO_ASAR=1

    :: 启动开发服务器
    echo 正在启动webpack开发服务器... >> %LOG_FILE%
    start /b cmd /c "npx webpack serve --config webpack.config.js" >> %LOG_FILE% 2>&1

    :: 等待webpack开发服务器启动
    echo 正在等待开发服务器启动...
    echo 正在等待开发服务器启动... >> %LOG_FILE%
    timeout /t 5 /nobreak > nul

    :: 启动Electron应用
    echo 正在启动Electron应用...
    echo 正在启动Electron应用... >> %LOG_FILE%
    call npx electron --disable-gpu --disable-software-rasterizer --disable-gpu-compositing --disable-gpu-rasterization --disable-gpu-sandbox --no-sandbox . >> %LOG_FILE% 2>&1
    
    :: 检查启动是否成功
    if %ERRORLEVEL% neq 0 (
        echo Electron应用启动失败，请检查错误信息。
        echo Electron应用启动失败，错误代码: %ERRORLEVEL% >> %LOG_FILE%
        goto :ERROR_EXIT
    )
)

goto :SUCCESS_EXIT

:SUCCESS_EXIT
echo 应用程序已成功启动 >> %LOG_FILE%
echo.
echo 操作已完成。
echo.
timeout /t 3 > nul
exit /b 0

:ERROR_EXIT
echo 启动过程中出现错误 >> %LOG_FILE%
echo.
echo 启动过程中出现错误，请检查上面的错误信息。
echo 详细日志已保存至: %LOG_FILE%
echo.
echo 按任意键退出...
pause > nul
exit /b 1

:END
echo.
echo 操作已完成。 >> %LOG_FILE%
echo 操作已完成。
echo.
exit /b 0 