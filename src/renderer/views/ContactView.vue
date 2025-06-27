<template>
  <div class="contact-view">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <button class="back-button" @click="goBack">
        <i class="back-icon"></i>
      </button>
      <h1 class="page-title">Contact Us</h1>
      <div class="placeholder"></div>
    </div>
    
    <!-- 主内容区 -->
    <div class="contact-content">
      <div class="qr-code-container">
        <div class="qr-code-item">
          <div class="qr-code-image">
            <img :src="getImageUrl('WeChatQR.png')" alt="WeChat QR Code" @error="handleImageError">
          </div>
          <div class="qr-code-label">Wechat</div>
        </div>
        
        <div class="qr-code-item">
          <div class="qr-code-image">
            <img :src="getImageUrl('WhatsAppQR.jpg')" alt="WhatsApp QR Code" @error="handleImageError">
          </div>
          <div class="qr-code-label">Whatsapp</div>
        </div>
      </div>
      
      <div class="contact-info">
        <div class="contact-item">
          <div class="contact-icon email-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M2 7L12 14L22 7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="contact-text">Rusindisplay.com</div>
        </div>
        
        <div class="contact-item">
          <div class="contact-icon web-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2C16.97 2 21 6.03 21 11C21 15.97 16.97 20 12 20C7.03 20 3 15.97 3 11C3 6.03 7.03 2 12 2Z" stroke="currentColor" stroke-width="2"/>
              <path d="M2 12H22" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2C14.5 5 15.5 8 15.5 12C15.5 16 14.5 19 12 22C9.5 19 8.5 16 8.5 12C8.5 8 9.5 5 12 2Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="contact-text">info@rusindisplay.com</div>
        </div>
      </div>
      
      <div class="footer-text">
        © 2025 Shenzhen Rusin Technology Co., Ltd
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getImageUrl } from '../assets/local-images';
import { useThemeStore } from '@/stores/theme';
import { onMounted } from 'vue';

const router = useRouter();
const themeStore = useThemeStore();

// 返回上一页
function goBack() {
  router.go(-1);
}

// 处理图片加载错误
function handleImageError(event) {
  console.log('QR code image failed to load, using fallback image');
  // 使用默认图片占位符
  event.target.src = 'data:image/svg+xml,<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%23f8f9fa"/><rect x="50" y="50" width="100" height="100" fill="%23dee2e6" stroke="%236c757d" stroke-width="2"/><path d="M70,70 L90,70 L90,90 L70,90 Z" fill="%236c757d"/><path d="M110,70 L130,70 L130,90 L110,90 Z" fill="%236c757d"/><path d="M70,110 L90,110 L90,130 L70,130 Z" fill="%236c757d"/><rect x="110" y="110" width="20" height="20" fill="%236c757d"/><text x="100" y="160" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="%236c757d">QR Code</text></svg>';
}

// 组件挂载时确保主题样式应用到图标
onMounted(() => {
  console.log('[ContactView] 当前主题:', themeStore.currentThemeId);
});
</script>

<style scoped>
.contact-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-backgroundAlt, white);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(12 * var(--vw-unit)) calc(16 * var(--vw-unit));
  background-color: var(--color-backgroundDark, rgb(245,245,245));
  border-bottom: var(--border-width) solid var(--color-border, #f0f0f0);
  height: calc(56 * var(--vw-unit));
  box-sizing: border-box;
}

.back-button {
  width: calc(32 * var(--vw-unit));
  height: calc(32 * var(--vw-unit));
  border-radius: 50%;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(16 * var(--vw-unit));
  cursor: pointer;
}

.back-icon {
  position: relative;
  width: calc(10 * var(--vw-unit));
  height: calc(16 * var(--vw-unit));
  display: block;
}

.back-icon::before,
.back-icon::after {
  content: "";
  position: absolute;
  width: calc(10 * var(--vw-unit));
  height: calc(2 * var(--vw-unit));
  background-color: var(--color-textSecondary, rgb(147,147,147));
  left: 0;
}

.back-icon::before {
  top: 40%;
  transform: rotate(-50deg);
  transform-origin: left center;
}

.back-icon::after {
  bottom: 40%;
  transform: rotate(50deg);
  transform-origin: left center;
}

.page-title {
  font-size: calc(18 * var(--vw-unit));
  font-weight: bold;
  margin: 0;
  color: var(--color-textPrimary, #333);
}

.placeholder {
  width: calc(32 * var(--vw-unit));
}

/* 主内容区 */
.contact-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(24 * var(--vw-unit));
  overflow-y: auto;
}

/* 二维码区域 */
.qr-code-container {
  display: flex;
  justify-content: center;
  gap: calc(40 * var(--vw-unit));
  margin-top: calc(40 * var(--vw-unit));
  margin-bottom: calc(50 * var(--vw-unit));
  width: 100%;
}

.qr-code-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-code-image {
  width: calc(140 * var(--vw-unit));
  height: calc(140 * var(--vw-unit));
  border-radius: calc(10 * var(--vw-unit));
  overflow: hidden;
  margin-bottom: calc(12 * var(--vw-unit));
  background-color: white;
  border: var(--border-width) solid var(--color-border, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 calc(2 * var(--vw-unit)) calc(8 * var(--vw-unit)) rgba(0, 0, 0, 0.05);
}

.qr-code-image img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.qr-code-label {
  font-size: calc(16 * var(--vw-unit));
  color: var(--color-textPrimary, #333);
  text-align: center;
  font-weight: 500;
}

/* 联系信息 */
.contact-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: calc(24 * var(--vw-unit));
  margin-top: calc(20 * var(--vw-unit));
  max-width: calc(320 * var(--vw-unit));
}

.contact-item {
  display: flex;
  align-items: center;
  gap: calc(16 * var(--vw-unit));
  padding: calc(16 * var(--vw-unit));
  background-color: var(--color-backgroundDark, rgb(245,245,245));
  border-radius: calc(12 * var(--vw-unit));
  box-shadow: 0 calc(2 * var(--vw-unit)) calc(8 * var(--vw-unit)) rgba(0, 0, 0, 0.05);
}

.contact-icon {
  width: calc(40 * var(--vw-unit));
  height: calc(40 * var(--vw-unit));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-blueButton, rgb(0, 33, 170));
  color: white;
  flex-shrink: 0;
}

.contact-text {
  font-size: calc(16 * var(--vw-unit));
  color: var(--color-textPrimary, #333);
  font-weight: 500;
}

/* 底部版权信息 */
.footer-text {
  margin-top: auto;
  padding: calc(20 * var(--vw-unit)) 0;
  font-size: calc(14 * var(--vw-unit));
  color: var(--color-textLight, #999);
  text-align: center;
}
</style> 