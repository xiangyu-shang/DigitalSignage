@echo off
chcp 65001 > nul
title 咖啡及饮品商品展示系统 - 构建工具

:: 错误处理，确保不会闪退
setlocal EnableDelayedExpansion

:: 创建日志目录
if not exist "logs" mkdir logs

:: 设置日志文件
set LOG_FILE=logs\build-log-%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%.txt
set LOG_FILE=%LOG_FILE: =0%

echo ================================================
echo       咖啡及饮品商品展示系统 - 构建工具
echo ================================================
echo.

echo 构建日志将保存至: %LOG_FILE%
echo 构建日志 - %date% %time% > %LOG_FILE%
echo ================================================ >> %LOG_FILE%

set APPPATH=%~dp0
cd /d "%APPPATH%"

:: 检查Node.js环境
echo 正在检查环境...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未检测到Node.js环境，请先安装Node.js
    echo 错误: 未检测到Node.js环境，请先安装Node.js >> %LOG_FILE%
    goto :ERROR_EXIT
)
echo Node.js版本: >> %LOG_FILE%
node -v >> %LOG_FILE% 2>&1
echo NPM版本: >> %LOG_FILE%
npm -v >> %LOG_FILE% 2>&1

:: 检查依赖
echo 正在检查依赖...
if not exist "%APPPATH%node_modules" (
    echo 首次运行，正在安装依赖...
    echo 首次运行，正在安装依赖... >> %LOG_FILE%
    call npm install >> %LOG_FILE% 2>&1
    if %ERRORLEVEL% neq 0 (
        echo 安装依赖失败，请检查网络连接后重试。
        echo 安装依赖失败，请检查错误信息。 >> %LOG_FILE%
        goto :ERROR_EXIT
    )
)

echo.
echo 选择构建类型:
echo 1. 开发环境构建
echo 2. 生产环境构建(推荐)
echo 3. 便携版构建
echo.

set /p buildType=请选择构建类型(1-3): 
echo 选择的构建类型: %buildType% >> %LOG_FILE%

if "%buildType%"=="1" (
    echo 正在为开发环境构建应用...
    echo 正在为开发环境构建应用... >> %LOG_FILE%
    
    :: 使用npm脚本启动webpack开发服务器
    call npm run dev >> %LOG_FILE% 2>&1
    
) else if "%buildType%"=="2" (
    echo 正在为生产环境构建应用...
    echo 正在为生产环境构建应用... >> %LOG_FILE%
    
    :: 先构建前端资源(仅webpack部分)
    echo 正在构建前端资源...
    call :BuildWebpackOnly
    
    if %ERRORLEVEL% neq 0 (
        echo 前端资源构建失败，请检查错误信息。
        echo 前端资源构建失败，错误代码: %ERRORLEVEL% >> %LOG_FILE%
        goto :ERROR_EXIT
    )
    
    echo 前端资源构建成功! >> %LOG_FILE%
    
    :: 验证dist目录是否存在
    if not exist "%APPPATH%dist" (
        echo 错误: 前端资源构建似乎成功了，但dist目录不存在。
        echo 错误: 前端资源构建似乎成功了，但dist目录不存在。 >> %LOG_FILE%
        goto :ERROR_EXIT
    )
    
    :: 构建electron应用
    echo 前端资源构建完成，正在打包应用...
    echo 前端资源构建完成，正在打包应用... >> %LOG_FILE%
    
    :: 确保在正确的目录
    cd /d "%APPPATH%"
    
    :: 检查electron-builder是否存在
    if exist "%APPPATH%node_modules\.bin\electron-builder.cmd" (
        echo 使用electron-builder.cmd构建... >> %LOG_FILE%
        call "%APPPATH%node_modules\.bin\electron-builder.cmd" --win --config electron.config.js >> %LOG_FILE% 2>&1
    ) else if exist "%APPPATH%node_modules\electron-builder\cli\bin.js" (
        echo 使用node调用electron-builder构建... >> %LOG_FILE%
        node "%APPPATH%node_modules\electron-builder\cli\bin.js" --win --config electron.config.js >> %LOG_FILE% 2>&1
    ) else (
        echo 尝试使用npx调用electron-builder... >> %LOG_FILE%
        call npx electron-builder --win --config electron.config.js >> %LOG_FILE% 2>&1
    )
    
    if %ERRORLEVEL% neq 0 (
        echo Electron应用打包失败，请检查日志文件: %LOG_FILE%
        echo Electron应用打包失败，错误代码: %ERRORLEVEL% >> %LOG_FILE%
        goto :ERROR_EXIT
    )
    
) else if "%buildType%"=="3" (
    echo 正在构建便携版应用...
    echo 正在构建便携版应用... >> %LOG_FILE%
    
    :: 先构建前端资源(仅webpack部分)
    echo 正在构建前端资源...
    call :BuildWebpackOnly
    
    if %ERRORLEVEL% neq 0 (
        echo 前端资源构建失败，请检查错误信息。
        echo 前端资源构建失败，错误代码: %ERRORLEVEL% >> %LOG_FILE%
        goto :ERROR_EXIT
    )
    
    echo 前端资源构建成功! >> %LOG_FILE%
    
    :: 验证dist目录是否存在
    if not exist "%APPPATH%dist" (
        echo 错误: 前端资源构建似乎成功了，但dist目录不存在。
        echo 错误: 前端资源构建似乎成功了，但dist目录不存在。 >> %LOG_FILE%
        goto :ERROR_EXIT
    )
    
    :: 构建便携版应用
    echo 前端资源构建完成，正在打包便携版应用...
    echo 前端资源构建完成，正在打包便携版应用... >> %LOG_FILE%
    
    :: 确保在正确的目录
    cd /d "%APPPATH%"
    
    :: 检查electron-builder是否存在
    if exist "%APPPATH%node_modules\.bin\electron-builder.cmd" (
        echo 使用electron-builder.cmd构建... >> %LOG_FILE%
        call "%APPPATH%node_modules\.bin\electron-builder.cmd" --win portable --config electron.config.js >> %LOG_FILE% 2>&1
    ) else if exist "%APPPATH%node_modules\electron-builder\cli\bin.js" (
        echo 使用node调用electron-builder构建... >> %LOG_FILE%
        node "%APPPATH%node_modules\electron-builder\cli\bin.js" --win portable --config electron.config.js >> %LOG_FILE% 2>&1
    ) else (
        echo 尝试使用npx调用electron-builder... >> %LOG_FILE%
        call npx electron-builder --win portable --config electron.config.js >> %LOG_FILE% 2>&1
    )
    
    if %ERRORLEVEL% neq 0 (
        echo Electron应用打包失败，请检查日志文件: %LOG_FILE%
        echo Electron应用打包失败，错误代码: %ERRORLEVEL% >> %LOG_FILE%
        goto :ERROR_EXIT
    )
    
) else (
    echo 输入错误，请重新运行脚本选择。
    echo 输入错误，用户选择了无效的构建类型: %buildType% >> %LOG_FILE%
    goto :ERROR_EXIT
)

:: 检查release目录
if exist "%APPPATH%release" (
    echo 检查release目录中的文件... >> %LOG_FILE%
    dir "%APPPATH%release" /s >> %LOG_FILE%
) else (
    echo 警告: release目录不存在，可能未生成输出文件。 >> %LOG_FILE%
)

echo.
echo 构建完成！
echo 构建完成！ >> %LOG_FILE%
echo.
echo 应用安装包位于: %APPPATH%release 目录
echo.
echo 请查看"安装与使用指南.md"获取更多信息。
echo 构建日志文件位置: %LOG_FILE%
echo.
goto :NORMAL_EXIT

:ERROR_EXIT
echo.
echo 构建过程中出现错误，请检查上面的错误信息。
echo 详细日志已保存至: %LOG_FILE%
echo.
echo 按任意键退出...
pause > nul
exit /b 1

:NORMAL_EXIT
echo.
echo 按任意键退出...
pause > nul
exit /b 0

:: 仅构建webpack部分的函数，避免build脚本循环调用
:BuildWebpackOnly
echo 正在运行webpack构建...
echo 正在运行webpack构建... >> %LOG_FILE%

set NODE_ENV=production

:: 检查webpack是否存在
if exist "%APPPATH%node_modules\.bin\webpack.cmd" (
    echo 使用webpack.cmd构建... >> %LOG_FILE%
    call "%APPPATH%node_modules\.bin\webpack.cmd" --config webpack.config.js --progress >> %LOG_FILE% 2>&1
) else if exist "%APPPATH%node_modules\webpack\bin\webpack.js" (
    echo 使用node调用webpack构建... >> %LOG_FILE%
    node "%APPPATH%node_modules\webpack\bin\webpack.js" --config webpack.config.js --progress >> %LOG_FILE% 2>&1
) else (
    echo 尝试使用npx调用webpack... >> %LOG_FILE%
    call npx webpack --config webpack.config.js --progress >> %LOG_FILE% 2>&1
)

set WEBPACK_RESULT=%ERRORLEVEL%
if %WEBPACK_RESULT% neq 0 (
    echo Webpack构建失败，错误代码: %WEBPACK_RESULT% >> %LOG_FILE%
) else (
    echo Webpack构建成功 >> %LOG_FILE%
)
exit /b %WEBPACK_RESULT% 