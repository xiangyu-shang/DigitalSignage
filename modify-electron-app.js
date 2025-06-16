/**
 * 在渲染进程中修改Electron应用配置
 * 用于禁用所有可能的GPU和缓存相关功能
 */

// 本脚本可以在渲染进程的入口文件(通常是main.js或index.js)中引入

// 禁用WebGL和相关GPU加速
function disableRendererGPU() {
  try {
    // 尝试禁用WebGL相关API
    if (window.WebGLRenderingContext) {
      // 保存原始的getContext函数
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      
      // 覆盖getContext函数，拦截WebGL相关调用
      HTMLCanvasElement.prototype.getContext = function(contextType, ...args) {
        // 拦截WebGL相关调用
        if (contextType === 'webgl' || contextType === 'webgl2' || 
            contextType === 'experimental-webgl' || contextType === 'experimental-webgl2') {
          console.warn(`已拦截WebGL上下文创建: ${contextType}`);
          // 返回一个dummy对象，避免空引用错误
          return {
            canvas: this,
            drawingBufferWidth: this.width,
            drawingBufferHeight: this.height,
            getExtension: () => null,
            getParameter: () => null,
            getShaderPrecisionFormat: () => ({ precision: 0, rangeMin: 0, rangeMax: 0 }),
            getContextAttributes: () => ({}),
            // 添加其他必要的模拟方法...
          };
        }
        
        // 对于其他上下文类型，使用原始函数
        return originalGetContext.call(this, contextType, ...args);
      };
      
      console.log('已禁用WebGL API');
    }
    
    // 禁用CSS硬件加速
    const style = document.createElement('style');
    style.textContent = `
      * {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        transform-style: flat !important;
        -webkit-transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000px;
        -webkit-transform-style: flat !important;
      }
    `;
    document.head.appendChild(style);
    console.log('已禁用CSS硬件加速');
    
    // 设置视频元素禁用硬件加速
    const disableVideoAcceleration = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        video.setAttribute('disableRemotePlayback', '');
        video.setAttribute('controlsList', 'nodownload');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');
        video.onloadedmetadata = function() {
          this.play().catch(e => console.error('视频播放失败:', e));
        };
      });
    };
    
    // 监听DOM变化，禁用新增的视频元素
    if (window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        disableVideoAcceleration();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // 初始调用以处理现有视频
    document.addEventListener('DOMContentLoaded', disableVideoAcceleration);
    
  } catch (error) {
    console.error('禁用渲染器GPU功能失败:', error);
  }
}

// 添加UTF-8编码支持
function addChineseSupport() {
  try {
    // 确保页面标明编码
    const metaCharset = document.querySelector('meta[charset]');
    if (!metaCharset) {
      const meta = document.createElement('meta');
      meta.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(meta, document.head.firstChild);
    }
    
    // 添加内容类型元标记
    const metaContentType = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!metaContentType) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Type');
      meta.setAttribute('content', 'text/html; charset=UTF-8');
      document.head.insertBefore(meta, document.head.firstChild);
    }
    
    console.log('已添加中文支持相关标记');
  } catch (error) {
    console.error('添加中文支持失败:', error);
  }
}

// 自动运行所有修改
function applyAllModifications() {
  console.log('正在应用渲染进程修改...');
  
  // 在DOMContentLoaded事件时应用修改
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      disableRendererGPU();
      addChineseSupport();
    });
  } else {
    // 如果DOM已经加载完成，立即应用
    disableRendererGPU();
    addChineseSupport();
  }
}

// 立即执行
applyAllModifications();

// 导出修改函数，供其他模块调用
module.exports = {
  disableRendererGPU,
  addChineseSupport,
  applyAllModifications
}; 