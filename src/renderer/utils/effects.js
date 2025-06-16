import { Howl } from 'howler';
import { useSettingsStore } from '../stores/settings';

/**
 * 水波纹效果类
 */
class RippleEffect {
  /**
   * 创建水波纹效果
   * @param {Object} options - 配置选项
   * @param {boolean} options.enabled - 是否启用水波纹效果
   * @param {string} options.color - 水波纹颜色
   * @param {number} options.duration - 动画持续时间(ms)
   */
  constructor(options = {}) {
    this.options = {
      enabled: true,
      color: 'rgba(255, 255, 255, 0.35)',
      duration: 800,
      ...options
    };
    
    this.settingsStore = useSettingsStore();
  }
  
  /**
   * 初始化水波纹效果
   */
  init() {
    document.addEventListener('click', this.handleClick.bind(this));
  }
  
  /**
   * 处理点击事件，创建水波纹
   * @param {MouseEvent} event - 点击事件
   */
  handleClick(event) {
    // 如果水波纹效果被禁用，直接返回
    if (!this.settingsStore.rippleEffectEnabled) return;
    
    // 使用event.target代替currentTarget
    const target = event.target;
    
    // 增强检查，确保target是DOM元素且有getBoundingClientRect方法
    if (!target || !target.nodeType || typeof target.getBoundingClientRect !== 'function') {
      return;
    }
    
    // 如果点击目标有 .no-ripple 类或其父级元素有此类，不创建水波纹
    if (target.classList && target.classList.contains('no-ripple')) {
      return;
    }
    
    // 查找父级元素中是否有.no-ripple类
    let parent = target.parentElement;
    while (parent) {
      if (parent.classList && parent.classList.contains('no-ripple')) {
        return;
      }
      parent = parent.parentElement;
    }
    
    try {
      // 创建水波纹元素
      const ripple = document.createElement('span');
      const rect = target.getBoundingClientRect();
      
      // 计算水波纹大小和位置
      const size = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      // 设置水波纹样式
      ripple.className = 'ripple-effect';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.backgroundColor = this.options.color;
      ripple.style.animationDuration = `${this.options.duration}ms`;
      
      // 将水波纹添加到点击的元素上
      // 确保容器有相对定位
      const position = window.getComputedStyle(target).position;
      if (position === 'static') {
        target.style.position = 'relative';
        target.style.overflow = 'hidden';
      }
      
      // 只有当元素可以安全添加子元素时才添加水波纹
      if (
        target.tagName !== 'INPUT' && 
        target.tagName !== 'SELECT' && 
        target.tagName !== 'TEXTAREA' &&
        !['img', 'br', 'hr', 'iframe', 'canvas', 'video', 'audio'].includes(target.tagName.toLowerCase())
      ) {
        target.appendChild(ripple);
        
        // 动画结束后移除水波纹
        setTimeout(() => {
          if (ripple.parentNode === target) {
            ripple.remove();
          }
        }, this.options.duration);
      }
    } catch (error) {
      console.warn('创建水波纹效果时发生错误:', error);
    }
  }
  
  /**
   * 销毁水波纹效果，移除事件监听
   */
  destroy() {
    document.removeEventListener('click', this.handleClick.bind(this));
  }
}

/**
 * 音效管理类
 */
class SoundManager {
  /**
   * 创建音效管理器
   */
  constructor() {
    this.settingsStore = useSettingsStore();
    this.sounds = {};
    this.init();
  }
  
  /**
   * 初始化音效
   */
  init() {
    // 预加载常用音效
    this.register('click', '/sounds/click.mp3');
    this.register('success', '/sounds/success.mp3');
    this.register('error', '/sounds/error.mp3');
    this.register('add', '/sounds/add.mp3');
    this.register('remove', '/sounds/remove.mp3');
  }
  
  /**
   * 注册一个音效
   * @param {string} name - 音效名称
   * @param {string} src - 音效文件路径
   */
  register(name, src) {
    this.sounds[name] = new Howl({
      src: [src],
      volume: 0.5,
      preload: true,
    });
  }
  
  /**
   * 播放指定音效
   * @param {string} name - 音效名称
   */
  play(name) {
    // 如果音效被禁用，直接返回
    if (!this.settingsStore.soundEnabled) return;
    
    const sound = this.sounds[name];
    if (sound) {
      sound.play();
    } else {
      console.warn(`音效 "${name}" 未注册`);
    }
  }
  
  /**
   * 停止指定音效
   * @param {string} name - 音效名称
   */
  stop(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.stop();
    }
  }
  
  /**
   * 停止所有音效
   */
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.stop();
    });
  }
}

// 导出单例实例
export const rippleEffect = new RippleEffect();
export const soundManager = new SoundManager();

/**
 * 添加水波纹CSS样式到文档
 */
function addRippleStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 800ms linear;
      pointer-events: none;
      z-index: 9999;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// 初始化
export function initEffects() {
  addRippleStyle();
  rippleEffect.init();
}

export default {
  rippleEffect,
  soundManager,
  initEffects,
}; 