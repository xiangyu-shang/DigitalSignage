import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

/**
 * 色系转换工具函数
 * 根据基础色生成统一的色系
 */
const generateColorSystem = (baseColor) => {
  // 解析基础色的RGB值
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  // RGB转Hex
  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };
  
  // 创建颜色变体
  const rgb = hexToRgb(baseColor);
  if (!rgb) return {};
  
  // 生成色系
  return {
    base: baseColor,                                             // 基础色
    dark: rgbToHex(Math.max(0, rgb.r * 0.8), Math.max(0, rgb.g * 0.8), Math.max(0, rgb.b * 0.8)),   // 深色变体
    darker: rgbToHex(Math.max(0, rgb.r * 0.6), Math.max(0, rgb.g * 0.6), Math.max(0, rgb.b * 0.6)), // 更深色变体
    light: rgbToHex(Math.min(255, rgb.r + (255-rgb.r)*0.3), Math.min(255, rgb.g + (255-rgb.g)*0.3), Math.min(255, rgb.b + (255-rgb.b)*0.3)), // 浅色变体
    lighter: rgbToHex(Math.min(255, rgb.r + (255-rgb.r)*0.6), Math.min(255, rgb.g + (255-rgb.g)*0.6), Math.min(255, rgb.b + (255-rgb.b)*0.6)), // 更浅色变体
    bg: rgbToHex(Math.min(255, rgb.r + (255-rgb.r)*0.85), Math.min(255, rgb.g + (255-rgb.g)*0.85), Math.min(255, rgb.b + (255-rgb.b)*0.85))  // 背景色变体
  };
};

// 基础色系定义
const blueSystem = generateColorSystem('#003cc8'); // 蓝色系（自提）
const orangeSystem = generateColorSystem('#ff5000'); // 橙色系（外送）

/**
 * 精确颜色映射表 - 将特定的橙色系颜色精确映射到蓝色系对应颜色
 * 这比使用整体色系转换更精确，减少颜色映射错误
 */
const preciseColorMapping = {
  // 橙色系到蓝色系 (alternate -> default)
  'orangeToBlue': {
    '#ff5000': '#003cc8', // 基础橙色到基础蓝色
    '#cc4000': '#00309f', // 深橙色到深蓝色
    '#992f00': '#002376', // 更深橙色到更深蓝色
    '#ff7333': '#3363e0', // 浅橙色到浅蓝色
    '#ff9666': '#668aff', // 更浅橙色到更浅蓝色
    '#ffece6': '#e6ecff', // 橙色背景到蓝色背景
    'rgb(255, 80, 0)': 'rgb(0, 60, 200)', // RGB橙色到RGB蓝色
    'rgb(204, 64, 0)': 'rgb(0, 48, 159)', // RGB深橙色到RGB深蓝色
    'rgb(153, 47, 0)': 'rgb(0, 35, 118)', // RGB更深橙色到RGB更深蓝色
    // 添加price相关元素颜色映射
    '#fff0e8': '#e6ecff', // 价格标签背景
    '#ffe0cc': '#ccd6ff', // 价格标签边框
    // 添加特殊RGB格式的颜色
    'rgb(255, 80, 0)': 'rgb(0, 60, 200)',
    'rgb(255, 115, 51)': 'rgb(51, 99, 224)',
    'rgb(255, 150, 102)': 'rgb(102, 138, 255)',
    // 添加内联SVG使用的格式
    '#0039ac': '#003cc8'
  },
  // 蓝色系到橙色系 (default -> alternate)
  'blueToOrange': {
    '#003cc8': '#ff5000', // 基础蓝色到基础橙色
    '#00309f': '#cc4000', // 深蓝色到深橙色
    '#002376': '#992f00', // 更深蓝色到更深橙色
    '#3363e0': '#ff7333', // 浅蓝色到浅橙色
    '#668aff': '#ff9666', // 更浅蓝色到更浅橙色
    '#e6ecff': '#ffece6', // 蓝色背景到橙色背景
    'rgb(0, 60, 200)': 'rgb(255, 80, 0)', // RGB蓝色到RGB橙色
    'rgb(0, 48, 159)': 'rgb(204, 64, 0)', // RGB深蓝色到RGB深橙色
    'rgb(0, 35, 118)': 'rgb(153, 47, 0)', // RGB更深蓝色到RGB更深橙色
    // 添加特殊RGB格式的颜色
    'rgb(51, 99, 224)': 'rgb(255, 115, 51)',
    'rgb(102, 138, 255)': 'rgb(255, 150, 102)',
    'rgb(0, 33, 170)': 'rgb(255, 80, 0)', // New标签颜色
    // 添加内联SVG使用的格式
    '#0039ac': '#cc4000', 
    '#003399': '#cc4000'
  }
};

/**
 * 颜色分组 - 根据用途对颜色进行分组，更精确地控制主题切换
 */
const colorGroups = {
  // 按钮组
  'buttons': {
    'default': {
      'primary': '#003cc8', // 蓝色按钮
      'dark': '#00309f', // 深蓝色按钮
      'light': '#3363e0' // 浅蓝色按钮
    },
    'alternate': {
      // 'primary': '#ff5000', // 橙色按钮
      // 'dark': '#cc4000', // 深橙色按钮
      // 'light': '#ff7333' // 浅橙色按钮
      'primary': '#003cc8', // 蓝色按钮
      'dark': '#00309f', // 深蓝色按钮
      'light': '#3363e0'
    }
  },
  // 标签组
  'tags': {
    'default': {
      'background': 'rgb(0, 33, 170)', // 蓝色标签背景
      'text': '#ffffff' // 标签文字颜色
    },
    'alternate': {
      'background': 'rgb(255, 80, 0)', // 橙色标签背景
      'text': '#ffffff' // 标签文字颜色
    }
  },
  // 价格组 - 完全反转颜色
  'prices': {
    'default': {
      'price': '#ff5000', // 蓝色主题下使用橙色价格
      'background': '#fff0e8', // 橙色背景
      'border': '#ffe0cc' // 橙色边框
    },
    'alternate': {
      // 'price': '#003cc8', // 橙色主题下使用蓝色价格
      // 'background': '#e6ecff', // 蓝色背景
      // 'border': '#ccd6ff' // 蓝色边框
      'price': '#ff5000', // 蓝色主题下使用橙色价格
      'background': '#fff0e8', // 橙色背景
      'border': '#ffe0cc' // 橙色边框
    }
  },
  // 数量气泡组 - 完全反转颜色
  'bubbles': {
    'default': {
      'background': '#FF5000', // 蓝色主题下使用橙色气泡
      'text': '#ffffff' // 气泡文字颜色
    },
    'alternate': {
      // 'background': '#003cc8', // 橙色主题下使用蓝色气泡
      // 'text': '#ffffff' // 气泡文字颜色
      'background': '#FF5000', // 蓝色主题下使用橙色气泡
      'text': '#ffffff' // 气泡文字颜色
    }
  },
  // SVG颜色组
  'svg': {
    'default': {
      'fill': '#003cc8', // SVG填充色
      'stroke': '#003cc8', // SVG描边色
      'darkFill': '#00309f', // 深色SVG填充
      'darkStroke': '#00309f' // 深色SVG描边
    },
    'alternate': {
      'fill': '#ff5000', // SVG填充色
      'stroke': '#ff5000', // SVG描边色
      'darkFill': '#cc4000', // 深色SVG填充
      'darkStroke': '#cc4000' // 深色SVG描边
    }
  }
};

/**
 * 定义默认主题和替代主题的颜色方案
 * 更细致的颜色分组，保持一致性
 */
const defaultTheme = {
  id: 'default',
  name: '默认主题-自提',
  colors: {
    // 主色系 - 蓝色系统
    primary: blueSystem.base, // 蓝色，常规 #003cc8
    primaryDark: blueSystem.dark, // 深蓝色，点击状态
    primaryDarker: blueSystem.darker, // 更深蓝色
    primaryLight: blueSystem.light, // 浅蓝色，辅助色
    primaryLighter: blueSystem.lighter, // 更浅蓝色
    primaryBg: blueSystem.bg, // 蓝色背景
    
    // 提示色
    warning: '#fec700', // 黄色，提示色
    error: '#f73d3e', // 红色，错误提示色
    success: '#4caf50', // 绿色，成功提示色
    
    // 背景色
    background: '#fafafa', // 浅灰色背景
    backgroundAlt: '#ffffff', // 白色背景
    backgroundDark: '#f0f0f0', // 深灰色背景
    
    // 文字色
    textPrimary: '#1d212a', // 标题文字
    textSecondary: '#343942', // 正文文字
    textTertiary: '#76797c', // 辅助文字
    textLight: '#b6b6b7', // 提示文字
    
    // 边框色
    border: '#e0e0e0', // 边框颜色
    borderLight: '#f0f0f0', // 浅色边框
    
    // 特殊元素色
    priceColor: colorGroups.prices.default.price, // 价格颜色
    priceTagBackground: colorGroups.prices.default.background, // 价格标签背景
    priceBorder: colorGroups.prices.default.border, // 价格标签边框
    
    // 统一所有蓝色系列按钮和元素
    blueButton: colorGroups.buttons.default.primary, // 蓝色按钮 #003cc8
    blueButtonDark: colorGroups.buttons.default.dark, // 深蓝色按钮
    blueButtonLight: colorGroups.buttons.default.light, // 浅蓝色按钮
    blueAccent: colorGroups.buttons.default.primary, // 蓝色强调
    blueAccentDark: colorGroups.buttons.default.dark, // 深蓝色强调
    
    // 商品数量气泡
    itemCountBubble: colorGroups.bubbles.default.background, // 购物车数量气泡背景色
  }
};

const alternateTheme = {
  id: 'alternate',
  name: '替代主题-外送',
  colors: {
    // 主色系 - 橙色系统
    primary: orangeSystem.base, // 橙色，常规 #ff5000
    primaryDark: orangeSystem.dark, // 深橙色，点击状态
    primaryDarker: orangeSystem.darker, // 更深橙色
    primaryLight: orangeSystem.light, // 浅橙色，辅助色
    primaryLighter: orangeSystem.lighter, // 更浅橙色
    primaryBg: orangeSystem.bg, // 橙色背景
    
    // 提示色
    warning: '#ffd000', // 黄色，提示色 - 略微调亮
    error: '#ff4d4d', // 红色，错误提示色 - 略微调亮
    success: '#4caf50', // 绿色，成功提示色
    
    // 背景色
    background: '#121212', // 深灰色背景
    backgroundAlt: '#000000', // 黑色背景
    backgroundDark: '#1e1e1e', // 更深的灰色背景
    
    // 文字色 - 增加对比度
    textPrimary: '#ffffff', // 标题文字 - 纯白色，增强对比
    textSecondary: '#f0f0f0', // 正文文字 - 浅灰白色，从 #e0e0e0 调亮
    textTertiary: '#cccccc', // 辅助文字 - 中等灰色，从 #b0b0b0 调亮
    textLight: '#aaaaaa', // 提示文字 - 深灰色，从rgb(184, 184, 184) 调亮
    
    // 边框色 - 降低深色模式下的对比度，增加50%透明度
    border: 'rgba(51, 51, 51, 0.5)', // 边框颜色，从 #333333 改为半透明
    borderLight: 'rgba(68, 68, 68, 0.5)', // 浅色边框，从 #444444 改为半透明
    
    // 特殊元素色
    priceColor: colorGroups.prices.alternate.price, // 价格颜色
    priceTagBackground: colorGroups.prices.alternate.background, // 价格标签背景
    priceBorder: colorGroups.prices.alternate.border, // 价格标签边框
    
    // 统一所有橙色系列按钮和元素
    blueButton: colorGroups.buttons.alternate.primary, // 橙色按钮
    blueButtonDark: colorGroups.buttons.alternate.dark, // 深橙色按钮
    blueButtonLight: colorGroups.buttons.alternate.light, // 浅橙色按钮
    blueAccent: colorGroups.buttons.alternate.primary, // 橙色强调
    blueAccentDark: colorGroups.buttons.alternate.dark, // 深橙色强调
    
    // 商品数量气泡
    itemCountBubble: colorGroups.bubbles.alternate.background, // 购物车数量气泡背景色
  }
};

// 添加兼容性映射表，将自定义元素转换为新的色系变量
const compatiblityMap = {
  // 默认主题兼容性映射
  'default': {
    'cartButton': 'blueButton',
    'checkoutBar': 'blueButton',
    'orderIcon': 'blueButtonDark',
    'itemCountBubble': 'itemCountBubble',
    'newTag': 'blueButton',
  },
  // 替代主题兼容性映射
  'alternate': {
    'cartButton': 'blueButton', // 现在会指向橙色
    'checkoutBar': 'blueButton', // 现在会指向橙色
    'orderIcon': 'blueButtonDark', // 现在会指向深橙色
    'itemCountBubble': 'itemCountBubble', // 数量气泡颜色
    'newTag': 'blueButton', // 新品标签颜色
  }
};

/**
 * 主题管理存储
 */
export const useThemeStore = defineStore('theme', () => {
  // 从本地存储加载当前主题
  const loadCurrentThemeId = () => {
    const savedThemeId = localStorage.getItem('current_theme_id');
    return savedThemeId || 'default';
  };
  
  // 当前主题ID
  const currentThemeId = ref(loadCurrentThemeId());
  
  // 可用主题列表
  const availableThemes = ref([defaultTheme, alternateTheme]);
  
  // 获取当前主题对象
  const currentTheme = ref(currentThemeId.value === 'default' ? defaultTheme : alternateTheme);
  
  // 更新当前主题
  const updateCurrentTheme = () => {
    currentTheme.value = availableThemes.value.find(theme => theme.id === currentThemeId.value) || defaultTheme;
    localStorage.setItem('current_theme_id', currentThemeId.value);
    applyThemeToDOM(currentTheme.value);
  };
  
  // 切换主题
  const toggleTheme = () => {
    currentThemeId.value = currentThemeId.value === 'default' ? 'alternate' : 'default';
    updateCurrentTheme();
  };
  
  // 设置特定主题
  const setTheme = (themeId) => {
    console.log(`尝试设置主题: ${themeId}, 当前主题: ${currentThemeId.value}`);
    
    if (themeId === currentThemeId.value) {
      console.log(`主题未变更，仍为: ${themeId}`);
      return;
    }
    
    if (availableThemes.value.some(theme => theme.id === themeId)) {
      console.log(`设置主题: ${themeId}`);
      currentThemeId.value = themeId;
      updateCurrentTheme();
    } else {
      console.warn(`主题 "${themeId}" 不存在，可用主题: ${availableThemes.value.map(t => t.id).join(', ')}`);
    }
  };
  
  /**
   * 根据精确的颜色映射表更新SVG元素颜色
   * @param {string} fromTheme - 原主题
   * @param {string} toTheme - 目标主题
   */
  const updateSvgElementsColor = (fromTheme, toTheme) => {
    console.log(`[updateSvgElementsColor] 从${fromTheme}主题切换到${toTheme}主题`);
    
    try {
      // 获取映射表
      const mappingKey = fromTheme === 'default' ? 'blueToOrange' : 'orangeToBlue';
      const colorMap = preciseColorMapping[mappingKey];
      
      if (!colorMap) {
        console.error(`未找到映射表: ${mappingKey}`);
        return;
      }
      
      // 对要转换的颜色进行预处理
      const normalizeColor = (color) => {
        if (!color) return null;
        
        // 移除空格并转换为小写
        color = color.trim().toLowerCase();
        
        // 处理RGB格式的颜色
        if (color.startsWith('rgb(')) {
          // 移除空格，确保格式一致
          return color.replace(/\s+/g, '');
        }
        
        return color;
      };
      
      // 获取映射颜色
      const getMappedColor = (originalColor) => {
        const normalizedColor = normalizeColor(originalColor);
        if (!normalizedColor) return null;
        
        // 尝试精确匹配
        if (colorMap[normalizedColor]) {
          return colorMap[normalizedColor];
        }
        
        // 尝试近似匹配（未来可以添加）
        
        return null;
      };
      
      // 1. 首先更新内联SVG元素
      document.querySelectorAll('svg path').forEach(path => {
        const fillColor = path.getAttribute('fill');
        const strokeColor = path.getAttribute('stroke');
        
        // 更新填充色
        if (fillColor) {
          const newFillColor = getMappedColor(fillColor);
          if (newFillColor) {
            path.setAttribute('fill', newFillColor);
            console.log(`[SVG] 更新填充色: ${fillColor} -> ${newFillColor}`);
          }
        }
        
        // 更新描边色
        if (strokeColor) {
          const newStrokeColor = getMappedColor(strokeColor);
          if (newStrokeColor) {
            path.setAttribute('stroke', newStrokeColor);
            console.log(`[SVG] 更新描边色: ${strokeColor} -> ${newStrokeColor}`);
          }
        }
      });
      
      // 2. 然后更新SVG背景图像
      setTimeout(() => {
        document.querySelectorAll('[style*="background-image"]').forEach(el => {
          const style = el.getAttribute('style');
          if (style && style.includes('svg')) {
            let newStyle = style;
            
            // 针对SVG背景图像，替换颜色值
            Object.entries(colorMap).forEach(([from, to]) => {
              // 使用特殊的转义处理
              const escapedFrom = from.replace('#', '%23');
              const escapedTo = to.replace('#', '%23');
              
              if (newStyle.includes(escapedFrom)) {
                newStyle = newStyle.replace(new RegExp(escapedFrom, 'g'), escapedTo);
                console.log(`[SVG背景] 更新颜色: ${from} -> ${to}`);
              }
            });
            
            if (newStyle !== style) {
              el.setAttribute('style', newStyle);
            }
          }
        });
        
        // 3. 最后更新SVG类名
        document.querySelectorAll('.svg-blue-fill, .svg-blue-stroke, .svg-blue-dark-fill, .svg-blue-dark-stroke').forEach(el => {
          // 强制刷新SVG类名，触发CSS变量重新应用
          const className = el.className.baseVal;
          el.classList.remove(className);
          setTimeout(() => {
            el.classList.add(className);
          }, 10);
        });
        
        console.log('[updateSvgElementsColor] SVG元素颜色更新完成');
      }, 50); // 延迟执行，确保DOM已经更新
      
    } catch (error) {
      console.error('更新SVG元素颜色时出错:', error);
    }
  };
  
  // 生成SVG颜色过滤器
  const generateSvgColorFilter = (hexColor) => {
    // 如果没有颜色，使用默认蓝色
    if (!hexColor) hexColor = '#003cc8';
    
    // 去掉#号
    hexColor = hexColor.replace('#', '');
    
    // 转换为RGB
    const r = parseInt(hexColor.substr(0, 2), 16) / 255;
    const g = parseInt(hexColor.substr(2, 2), 16) / 255;
    const b = parseInt(hexColor.substr(4, 2), 16) / 255;
    
    // 创建颜色矩阵
    return `brightness(0) saturate(100%) invert(19%) sepia(87%) saturate(${Math.round(r*100)}%) hue-rotate(${Math.round((b-r)*180)}deg) brightness(${Math.round(g*100)}%) contrast(105%)`;
  };
  
  // 将主题应用到DOM
  const applyThemeToDOM = (theme) => {
    console.log('应用主题到DOM:', theme ? theme.name : 'undefined');
    
    if (!theme || !theme.colors) {
      console.error('无效的主题对象:', theme);
      return;
    }
    
    try {
      const root = document.documentElement;
      const colors = theme.colors;
      const themeId = theme.id;
      const prevThemeId = localStorage.getItem('prev_theme_id') || 'default';
      
      // 如果前一个主题与当前主题相同，无需进行处理
      if (prevThemeId === themeId) {
        console.log(`当前主题与前一个主题相同 (${themeId})，无需重新应用`);
        return;
      }
      
      console.log(`应用主题：从 ${prevThemeId} 切换到 ${themeId}`);
      
      // 在应用前记录当前的CSS变量值
      console.log('应用前CSS变量值:', {
        primary: getComputedStyle(root).getPropertyValue('--color-primary'),
        blueButton: getComputedStyle(root).getPropertyValue('--color-blueButton'),
        warning: getComputedStyle(root).getPropertyValue('--color-warning'),
        background: getComputedStyle(root).getPropertyValue('--color-background')
      });
      
      // 先保存前一个主题ID
      localStorage.setItem('prev_theme_id', themeId);
      
      // 应用过程：
      // 1. 首先应用主要的CSS变量
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
        console.log(`设置 --color-${key} = ${value}`);
      });
      
      // 2. 然后应用兼容性映射
      if (compatiblityMap[themeId]) {
        Object.entries(compatiblityMap[themeId]).forEach(([oldKey, newKey]) => {
          if (colors[newKey]) {
            root.style.setProperty(`--color-${oldKey}`, colors[newKey]);
            console.log(`兼容性映射: --color-${oldKey} = --color-${newKey} (${colors[newKey]})`);
          }
        });
      }
      
      // 3. 更新旧的变量名称以保持兼容性
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-secondary', colors.primaryDark);
      root.style.setProperty('--color-accent', colors.error);
      root.style.setProperty('--color-background', colors.background);
      root.style.setProperty('--color-text', colors.textSecondary);
      root.style.setProperty('--color-text-light', colors.textTertiary);
      
      // 4. 生成并应用SVG颜色过滤器
      const svgFilter = generateSvgColorFilter(colors.blueButton);
      root.style.setProperty('--svg-color-filter', svgFilter);
      console.log(`设置 --svg-color-filter = ${svgFilter}`);
      
      // 5. 最后更新SVG元素颜色
      // 延迟处理，确保CSS变量已经应用
      setTimeout(() => {
        updateSvgElementsColor(prevThemeId, themeId);
      }, 50);
      
      console.log(`已应用主题: ${theme.name} (${theme.id})`);
      
      // 调试：打印所有应用后的CSS变量
      setTimeout(() => {
        console.log('应用后CSS变量值:', {
          primary: getComputedStyle(root).getPropertyValue('--color-primary'),
          primaryDark: getComputedStyle(root).getPropertyValue('--color-primaryDark'),
          blueButton: getComputedStyle(root).getPropertyValue('--color-blueButton'),
          cartButton: getComputedStyle(root).getPropertyValue('--color-cartButton'),
          warning: getComputedStyle(root).getPropertyValue('--color-warning'),
          error: getComputedStyle(root).getPropertyValue('--color-error'),
          background: getComputedStyle(root).getPropertyValue('--color-background'),
          itemCountBubble: getComputedStyle(root).getPropertyValue('--color-itemCountBubble')
        });
      }, 100);
    } catch (error) {
      console.error('应用主题时出错:', error);
    }
  };
  
  // 监听主题变化
  watch(currentThemeId, () => {
    updateCurrentTheme();
  });
  
  // 初始化：应用当前主题
  updateCurrentTheme();
  
  return {
    currentThemeId,
    currentTheme,
    availableThemes,
    toggleTheme,
    setTheme
  };
});

// 添加一些默认的色系样式
document.addEventListener('DOMContentLoaded', () => {
  console.log('[theme.js] DOMContentLoaded: 添加色系调试信息');
  
  // 打印基础色系信息
  console.log('蓝色系统:', blueSystem);
  console.log('橙色系统:', orangeSystem);
  console.log('精确颜色映射:', preciseColorMapping);
  console.log('颜色分组:', colorGroups);
  
  // 如果需要，可以在这里添加一些默认的全局样式
}); 