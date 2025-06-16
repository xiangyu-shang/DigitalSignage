@echo off
echo 正在启动无GPU缓存的Electron应用...
set ELECTRON_DISABLE_GPU=1
set ELECTRON_NO_ASAR=1
set ELECTRON_NO_ATTACH_CONSOLE=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1
set ELECTRON_DEFAULT_ERROR_MODE=1

cd /d "%~dp0"
electron --disable-gpu --disable-software-rasterizer --disable-gpu-compositing --disable-gpu-rasterization --disable-gpu-sandbox --no-sandbox .

echo 应用已退出，按任意键关闭窗口
pause > nul
