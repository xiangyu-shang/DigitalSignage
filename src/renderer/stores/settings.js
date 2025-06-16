import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

/**
 * 应用设置状态管理
 */
export const useSettingsStore = defineStore('settings', () => {
  // 从本地存储加载设置，如果没有则使用默认值
  const loadSetting = (key, defaultValue) => {
    const savedValue = localStorage.getItem(`settings_${key}`);
    return savedValue !== null ? JSON.parse(savedValue) : defaultValue;
  };
  
  // 保存设置到本地存储
  const saveSetting = (key, value) => {
    localStorage.setItem(`settings_${key}`, JSON.stringify(value));
  };
  
  // 水波纹效果开关
  const rippleEffectEnabled = ref(loadSetting('rippleEffectEnabled', true));
  
  // 音效开关
  const soundEnabled = ref(loadSetting('soundEnabled', true));
  
  // 音效音量 (0-1)
  const soundVolume = ref(loadSetting('soundVolume', 0.5));
  
  // 主题设置
  const theme = ref(loadSetting('theme', 'light'));
  
  // 语言设置
  const language = ref(loadSetting('language', 'zh-CN'));
  
  // 自动保存设置变化
  watch(rippleEffectEnabled, (value) => saveSetting('rippleEffectEnabled', value));
  watch(soundEnabled, (value) => saveSetting('soundEnabled', value));
  watch(soundVolume, (value) => saveSetting('soundVolume', value));
  watch(theme, (value) => saveSetting('theme', value));
  watch(language, (value) => saveSetting('language', value));
  
  /**
   * 重置所有设置为默认值
   */
  function resetToDefaults() {
    rippleEffectEnabled.value = true;
    soundEnabled.value = true;
    soundVolume.value = 0.5;
    theme.value = 'light';
    language.value = 'zh-CN';
  }
  
  /**
   * 更新设置
   * @param {Object} settings - 要更新的设置对象
   */
  function updateSettings(settings) {
    if (settings.rippleEffectEnabled !== undefined) {
      rippleEffectEnabled.value = settings.rippleEffectEnabled;
    }
    
    if (settings.soundEnabled !== undefined) {
      soundEnabled.value = settings.soundEnabled;
    }
    
    if (settings.soundVolume !== undefined) {
      soundVolume.value = Math.max(0, Math.min(1, settings.soundVolume));
    }
    
    if (settings.theme) {
      theme.value = settings.theme;
    }
    
    if (settings.language) {
      language.value = settings.language;
    }
  }
  
  return {
    rippleEffectEnabled,
    soundEnabled,
    soundVolume,
    theme,
    language,
    resetToDefaults,
    updateSettings,
  };
});