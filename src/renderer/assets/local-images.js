/**
 * 本地图片路径配置
 * 
 * 此文件用于解决图片路径问题，主要做两件事：
 * 1. 提供多种可能的图片路径前缀，解决不同环境下的路径问题
 * 2. 预加载常用图片，确保即使网络加载失败也能显示默认图片
 */

// 可能的图片路径前缀
const possiblePaths = [
  '/images/',        // 标准Web路径
  './images/',       // 相对当前目录
  '../public/images/', // 相对src目录
  'images/',         // 无前缀路径
];

// 关闭调试模式
const DEBUG = false;

// 默认占位图 - 使用内联SVG以确保始终可用
const DEFAULT_PLACEHOLDER_SVG = `data:image/svg+xml,<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%23f8f9fa"/><circle cx="150" cy="100" r="50" fill="%23e9ecef"/><path d="M75,200 L225,200 L150,275 Z" fill="%23dee2e6"/><text x="150" y="160" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="%236c757d">图片占位符</text></svg>`;

// 默认占位图
const DEFAULT_PLACEHOLDER = '/images/test-image-placeholder.svg';

// 图片缓存状态记录
const imageLoadStatus = {};

// 是否已经显示了图片丢失警告
let hasShownMissingImagesWarning = false;

/**
 * 获取图片URL - 主要入口点
 */
export function getImageUrl(imageName) {
  // 检查是否提供了有效的图片名称
  if (!imageName) {
    if (DEBUG) console.warn('[Image] 未提供图片名称，使用默认占位图');
    return DEFAULT_PLACEHOLDER_SVG; // 使用内联SVG确保不会加载失败
  }
  
  // 如果图片名已经包含了完整路径，直接返回
  if (imageName.startsWith('http') || imageName.startsWith('data:')) {
    return imageName;
  }
  
  // 移除任何已存在的路径前缀，只保留文件名
  const cleanImageName = imageName.split('/').pop();
  
  // 检查图片是否是placeholder占位图
  const isPlaceholder = cleanImageName.includes('placeholder');
  
  // 当图片名中包含"placeholder"时，尝试使用内联SVG而非PNG
  if (isPlaceholder && cleanImageName.endsWith('.png')) {
    return DEFAULT_PLACEHOLDER_SVG;
  }
  
  // 创建最终路径
  const resultPath = `/images/${cleanImageName}`;
  
  // 电子应用环境中的绝对路径
  return resultPath;
}

// 为图片添加错误处理，在加载失败时使用占位图
export function setupImageFallback(el) {
  if (!el) {
    if (DEBUG) console.warn('[Image] setupImageFallback: 未提供有效的DOM元素');
    return;
  }
  
  // 如果元素已经添加过错误处理，则不重复添加
  if (el.dataset.hasFallback) return el;
  
  el.dataset.hasFallback = 'true';
  el.dataset.originalSrc = el.src;
  
  // 记录图片加载状态
  el.addEventListener('load', function() {
    imageLoadStatus[el.src] = 'loaded';
  });
  
  el.addEventListener('error', function() {
    imageLoadStatus[el.src] = 'failed';
    
    // 防止循环引用 - 如果占位图也加载失败或者当前已经是占位图
    if (!el.src.includes('test-image-placeholder') && !el.src.includes('data:image/svg+xml')) {
      el.src = DEFAULT_PLACEHOLDER_SVG;
    }
  });
  
  return el;
}

// 全局图片加载监控函数
export function monitorAllImages() {
  if (DEBUG) console.log('[Image] 开始全局图片监控');
  
  // 监控当前所有图片
  document.querySelectorAll('img').forEach((img) => {
    setupImageFallback(img);
  });
  
  // 监控DOM变化，为新增的图片添加错误处理
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'IMG') {
            setupImageFallback(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach(setupImageFallback);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// 获取图片加载状态报告
export function getImageLoadReport() {
  return {
    total: Object.keys(imageLoadStatus).length,
    loaded: Object.values(imageLoadStatus).filter(s => s === 'loaded').length,
    failed: Object.values(imageLoadStatus).filter(s => s === 'failed').length,
    details: DEBUG ? imageLoadStatus : null
  };
}

// 默认导出图片路径对象
export default {
  // 饮品图片
  drink1_thumbnail: '/images/drink1_thumbnail.jpg',
  drink1_main: '/images/drink1_main.jpg',
  drink1_1: '/images/drink1_1.jpg',
  drink1_2: '/images/drink1_2.jpg',
  
  // 默认占位图片
  placeholder: DEFAULT_PLACEHOLDER_SVG,
}; 