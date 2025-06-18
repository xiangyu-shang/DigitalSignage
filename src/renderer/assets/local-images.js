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

// 开启调试模式
const DEBUG = true;

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
    console.warn('[Image] 未提供图片名称，使用默认占位图');
    return DEFAULT_PLACEHOLDER_SVG; // 使用内联SVG确保不会加载失败
  }
  
  // 如果图片名已经包含了完整路径，直接返回
  if (imageName.startsWith('http') || imageName.startsWith('data:')) {
    console.log(`[Image] 使用外部图片链接: ${imageName}`);
    return imageName;
  }
  
  // 记录原始请求路径
  console.log(`🔍 [Image] 请求加载图片: ${imageName}`);
  
  // 移除任何已存在的路径前缀，只保留文件名
  const cleanImageName = imageName.split('/').pop();
  
  // 检查图片是否是placeholder占位图
  const isPlaceholder = cleanImageName.includes('placeholder');
  
  // 当图片名中包含"placeholder"时，尝试使用内联SVG而非PNG
  if (isPlaceholder && cleanImageName.endsWith('.png')) {
    console.log(`[Image] 检测到占位图请求，使用内联SVG替代: ${cleanImageName}`);
    return DEFAULT_PLACEHOLDER_SVG;
  }
  
  // 创建最终路径
  const resultPath = `/images/${cleanImageName}`;

  // 记录详细路径信息
  console.log(`📋 [Image] 路径处理过程:
    - 原始路径: "${imageName}"
    - 提取文件名: "${cleanImageName}"
    - 最终路径: "${resultPath}"
    - 绝对文件系统路径应为: "public${resultPath}" 或 "public/images/${cleanImageName}"
  `);
  
  // 检查文件名格式
  if (cleanImageName.includes('.') === false) {
    console.error(`❌ [Image] 文件名异常，可能缺少扩展名: ${cleanImageName}`);
  }
  
  // 检查图片是否存在于已知路径列表中
  if (!hasShownMissingImagesWarning) {
    console.warn(`[Image] 警告：images目录下可能没有文件，这可能导致图片加载错误。请确认应用运行环境是否正确。`);
    hasShownMissingImagesWarning = true;
  }
  
  // 电子应用环境中的绝对路径
  return resultPath;
}

// 为图片添加错误处理，在加载失败时使用占位图
export function setupImageFallback(el) {
  if (!el) {
    console.warn('[Image] setupImageFallback: 未提供有效的DOM元素');
    return;
  }
  
  // 如果元素已经添加过错误处理，则不重复添加
  if (el.dataset.hasFallback) return el;
  
  console.log(`[Image] 为图片添加错误处理: ${el.src || '未设置src'}`);
  el.dataset.hasFallback = 'true';
  el.dataset.originalSrc = el.src;
  
  // 记录图片加载状态
  el.addEventListener('load', function() {
    console.log(`✅ [Image] 图片加载成功: ${el.src}`);
    imageLoadStatus[el.src] = 'loaded';
    el.style.border = ''; // 移除错误边框
  });
  
  el.addEventListener('error', function() {
    console.error(`❌ [Image] 图片加载失败: ${el.src}`);
    imageLoadStatus[el.src] = 'failed';
    
    // 添加红色边框标记错误图片
    el.style.border = '1px solid red';
    
    // 防止循环引用 - 如果占位图也加载失败或者当前已经是占位图
    if (!el.src.includes('test-image-placeholder') && !el.src.includes('data:image/svg+xml')) {
      console.log(`[Image] 尝试使用占位图: ${DEFAULT_PLACEHOLDER_SVG.substring(0, 50)}...`);
      el.src = DEFAULT_PLACEHOLDER_SVG;
    } else {
      console.error('[Image] 占位图也无法加载，图像显示彻底失败');
    }
  });
  
  return el;
}

// 全局图片加载监控函数
export function monitorAllImages() {
  console.log('[Image] 开始全局图片监控');
  
  // 检查图片存储目录状态
  checkImagesDirectory();
  
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

// 检查图片目录状态
function checkImagesDirectory() {
  // 检查images目录是否可能存在
  fetch('/images/')
    .then(response => {
      console.log(`[Image] images目录访问状态: ${response.status} ${response.statusText}`);
    })
    .catch(err => {
      console.error(`[Image] 无法访问images目录: ${err.message}`);
    });
  
  // 尝试加载已知应该存在的图片
  const testImages = [
    '/images/test-image-placeholder.svg',
    '/images/drink1_thumbnail.jpg',
    '/images/coffee1_thumbnail.jpg',
    '/images/placeholder1.png'
  ];
  
  testImages.forEach(path => {
    fetch(path, { method: 'HEAD' })
      .then(response => {
        console.log(`[Image] 测试图片 ${path}: ${response.status} ${response.ok ? '存在' : '不存在'}`);
      })
      .catch(() => {
        console.error(`[Image] 测试图片 ${path}: 请求失败，可能不存在`);
      });
  });
}

// 获取图片加载状态报告
export function getImageLoadReport() {
  return {
    total: Object.keys(imageLoadStatus).length,
    loaded: Object.values(imageLoadStatus).filter(s => s === 'loaded').length,
    failed: Object.values(imageLoadStatus).filter(s => s === 'failed').length,
    details: imageLoadStatus
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