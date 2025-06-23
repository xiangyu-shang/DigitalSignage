<template>
  <div class="detail-view">
    <!-- 返回按钮 -->
    <div class="nav-header">
      <button class="back-button" @click="goBack">
        <i class="back-icon"></i>
      </button>
    </div>
    
    <div class="detail-content" v-if="product">
      <!-- 商品图片区域 - 全屏宽度 -->
      <div class="product-image-container">
        <img 
          v-if="product.mainImage" 
          :src="getImageUrl(product.mainImage)" 
          class="product-img" 
          alt="Product Image"
          @error="(e) => handleImageError(e, product)"
          :data-product-id="product.id"
          :data-image-path="product.mainImage"
        >
        <div class="product-badge" v-if="product.discount > 0">New</div>
        <span v-if="!product.mainImage" class="product-image-text">{{ product.name }}</span>
      </div>
      
      <!-- 商品信息区 -->
      <div class="product-info-card">
        <div class="product-header">
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-desc">{{ product.description }}</p>
        </div>
        
        <div class="price-section">
          <div class="current-price">¥{{ product.price }}</div>
          <div class="price-tag" v-if="product.discount > 0">{{ Math.round(product.discount * 100) }}% OFF</div>
          <div class="original-price" v-if="product.originalPrice > product.price">Original ¥{{ product.originalPrice }}</div>
        </div>
        
        <!-- 规格选择区 -->
        <div class="specs-section">
          <!-- 杯型选择 -->
          <div class="option-row">
            <div class="option-label">Cup Size</div>
            <div class="option-values">
              <div 
                class="option-value cup-option" 
                :class="{ 'active': selectedOptions.size === 'Large 16oz' }"
                @click="selectSize('Large 16oz')"
              >
                <div class="cup-icon-container">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="cup-icon">
                    <!-- 杯子顶部 -->
                    <rect x="4" y="2" width="16" height="2" rx="1" fill="rgb(0, 33, 170)"/>
                    <!-- 杯子主体 -->
                    <path d="M6 4H18L17 19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19L6 4Z" stroke="rgb(0, 33, 170)" stroke-width="1.5"/>
                    <!-- 刻度线 -->
                    <line x1="9" y1="8" x2="9" y2="16" stroke="rgb(0, 33, 170)" stroke-width="0.75" stroke-dasharray="1 1.5"/>
                    <line x1="12" y1="8" x2="12" y2="16" stroke="rgb(0, 33, 170)" stroke-width="0.75" stroke-dasharray="1 1.5"/>
                    <line x1="15" y1="8" x2="15" y2="16" stroke="rgb(0, 33, 170)" stroke-width="0.75" stroke-dasharray="1 1.5"/>
                  </svg>
                </div>
                <div class="cup-text">Large 16oz</div>
              </div>
            </div>
          </div>
          
          <!-- 温度选择 -->
          <div class="option-row">
            <div class="option-label">Temperature</div>
            <div class="option-values">
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.temp === 'Iced' }"
                @click="selectTemp('Iced')"
              >
                Iced
              </div>
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.temp === 'Hot' }"
                @click="selectTemp('Hot')"
              >
                Hot
              </div>
            </div>
          </div>
          
          <!-- 糖度选择 -->
          <div class="option-row">
            <div class="option-label">Sweetness</div>
            <div class="option-values sugar-options">
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.sugar === 'Standard' }"
                @click="selectSugar('Standard')"
              >
                <div class="recommended-tag tag-right">Recommended 70% Sweet</div>
                Standard
              </div>
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.sugar === 'Less Sweet' }"
                @click="selectSugar('Less Sweet')"
              >
                Less Sweet
              </div>
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.sugar === 'Slightly Sweet' }"
                @click="selectSugar('Slightly Sweet')"
              >
                Slightly Sweet
              </div>
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.sugar === 'Lightly Sweet' }"
                @click="selectSugar('Lightly Sweet')"
              >
                Lightly Sweet
              </div>
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.sugar === 'No Added Sugar' }"
                @click="selectSugar('No Added Sugar')"
              >
                No Added Sugar
              </div>
            </div>
          </div>
          
          <!-- 奶基选择 -->
          <div class="option-row">
            <div class="option-label">Milk Base</div>
            <div class="option-values">
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.milk === 'Whole Milk' }"
                @click="selectMilk('Whole Milk')"
              >
                Whole Milk
              </div>
              <div 
                class="option-value" 
                :class="{ 'active': selectedOptions.milk === 'Oat Milk' }"
                @click="selectMilk('Oat Milk')"
              >
                <div class="recommended-tag tag-right">OATLY Barista</div>
                Oat Milk
              </div>
            </div>
          </div>
          
          <!-- 商品详情区 -->
          <div class="product-details">
            <h3 class="section-title">Product Details</h3>
            <div class="detail-row">
              <span class="detail-label">Energy</span>
              <span class="detail-value">Approx. {{ 200 + Math.round(product.price * 10) }} kcal/cup</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Main Ingredients</span>
              <span class="detail-value">{{ product.name }} Special Recipe</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Allergens</span>
              <span class="detail-value">None</span>
            </div>
            
            <div class="detail-notes">
              *Images are for reference only, please refer to the actual product<br>
              *Best enjoyed immediately for optimal flavor
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载中状态 -->
    <div class="loading-container" v-if="!product">
      <div class="loading-spinner"></div>
      <p>Loading product...</p>
    </div>
    
    <!-- 底部购买栏 -->
    <div class="bottom-actions" v-if="product">
      <div class="total-amount">
        <div class="amount-label">Total</div>
        <div class="amount-value">¥{{ totalPrice.toFixed(2) }}</div>
      </div>
      
      <div class="action-buttons">
        <button class="cart-btn" @click="addToCart">Add to Cart</button>
        <button class="buy-btn" @click="buyNow">Buy Now</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';
import { initEffects } from '@/utils/effects';
import { getImageUrl, getImageLoadReport } from '../assets/local-images';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const selectedOptions = ref({
  size: 'Large 16oz',
  temp: 'Iced',
  sugar: 'Less Sweet',
  milk: 'Whole Milk'
});

// 获取当前商品
const product = computed(() => productStore.currentProduct);

// 处理杯型选择 
function selectSize(size) {
  selectedOptions.value.size = size;
}

// 处理温度选择
function selectTemp(temp) {
  selectedOptions.value.temp = temp;
}

// 处理糖度选择
function selectSugar(sugar) {
  selectedOptions.value.sugar = sugar;
}

// 处理奶基选择
function selectMilk(milk) {
  selectedOptions.value.milk = milk;
}

// 计算总价
const totalPrice = computed(() => {
  if (!product.value) return 0;
  
  let price = product.value.price;
  
  // 如果选择燕麦奶，价格可能会有调整
  if (selectedOptions.value.milk === 'Oat Milk') {
    price += 2; // 假设燕麦奶比纯牛奶贵2元
  }
  
  return price;
});

// 返回上一页
function goBack() {
  router.go(-1);
}

// 加入购物车
function addToCart() {
  if (!product.value) return;
  
  cartStore.addItem(
    product.value,
    selectedOptions.value,
    1
  );
  
  // 显示成功提示
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = 'Added to Cart';
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 1500);
}

// 立即购买
function buyNow() {
  if (!product.value) return;
  
  // 先加入购物车
  cartStore.addItem(
    product.value,
    selectedOptions.value,
    1
  );
  
  // 跳转到结算页
  router.push({ name: 'End' });
}

// 获取分类背景色
function getCategoryColor(categoryId) {
  switch(categoryId) {
    case 'c1': return '#ffedd0';
    case 'c2': return '#e8f5e9';
    case 'c3': return '#e3f2fd';
    case 'c4': return '#fce4ec';
    case 'c5': return '#f3e5f5';
    case 'c6': return '#ede7f6';
    case 'c7': return '#e8eaf6';
    case 'c8': return '#e0f7fa';
    default: return '#f5f5f5';
  }
}

// 图片错误处理函数
function handleImageError(event, product) {
  console.error(`[DetailView] Image loading failed: ${event.target.src}`, {
    productId: product.id,
    productName: product.name,
    imagePath: event.target.getAttribute('data-image-path'),
    element: event.target
  });
  
  // 尝试其他路径格式
  console.log('[DetailView] Trying different image path formats');
  
  // 提取原始文件名
  const origFilename = product.mainImage.split('/').pop();
  
  // 尝试不同路径格式的加载
  const testPaths = [
    `/images/${origFilename}`,
    `./images/${origFilename}`,
    `../images/${origFilename}`,
    `images/${origFilename}`,
    `/public/images/${origFilename}`,
    `${product.mainImage}`
  ];
  
  testPaths.forEach(path => {
    const img = new Image();
    img.onload = () => console.log(`[DetailView] Path test successful: ${path}`);
    img.onerror = () => console.error(`[DetailView] Path test failed: ${path}`);
    img.src = path;
  });
}

// 组件挂载时
onMounted(() => {
  // 获取产品ID
  const productId = route.params.id;
  
  // 加载商品详情
  if (productId) {
    productStore.loadProductDetails(productId);
  }
  
  // 打印图片加载诊断
  setTimeout(() => {
    console.log('[DetailView] Image loading status report:', getImageLoadReport());
    
    if (product.value) {
      console.log('[DetailView] Current product image info:', {
        productId: product.value.id,
        productName: product.value.name,
        mainImage: product.value.mainImage,
        thumbnailImage: product.value.thumbnailImage,
        otherImages: product.value.images
      });
    }
  }, 3000);
});

// 组件卸载前
onBeforeUnmount(() => {
  console.log('[DetailView] Image loading report before component unmount:', getImageLoadReport());
});
</script>

<style scoped>
.detail-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
}

/* 顶部状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(4 * var(--vw-unit)) calc(16 * var(--vw-unit));
  background-color: transparent;
  color: #333;
  font-size: calc(12 * var(--vw-unit));
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: calc(24 * var(--vw-unit));
  box-sizing: border-box;
}

.status-right {
  display: flex;
  gap: calc(8 * var(--vw-unit));
}

/* 导航头部 */
.nav-header {
  position: absolute;
  top: calc(24 * var(--vw-unit)); 
  left: calc(16 * var(--vw-unit));
  z-index: 10;
}

.back-button {
  width: calc(32 * var(--vw-unit));
  height: calc(32 * var(--vw-unit));
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background-color: rgb(147,147,147);
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

/* 商品图片区域 */
.product-image-container {
  width: 100%;
  height: calc(400 * var(--vw-unit));
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
}

/* 商品图片样式 */
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 新品标签 */
.product-badge {
  position: absolute;
  top: calc(20 * var(--vw-unit));
  left: calc(20 * var(--vw-unit));
  background-color: rgb(0, 33, 170);
  color: white;
  font-size: calc(12 * var(--vw-unit));
  padding: calc(4 * var(--vw-unit)) calc(10 * var(--vw-unit));
  border-radius: calc(4 * var(--vw-unit));
  z-index: 5;
}

.product-image-text {
  font-size: calc(24 * var(--vw-unit));
  color: #333;
  text-align: center;
  max-width: 80%;
}

/* 商品信息卡片 */
.product-info-card {
  background-color: white;
  border-radius: calc(24 * var(--vw-unit)) calc(24 * var(--vw-unit)) 0 0;
  padding: calc(24 * var(--vw-unit)) calc(16 * var(--vw-unit)) calc(80 * var(--vw-unit));
  position: relative;
  margin-top: calc(-50 * var(--vw-unit));
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 350 * var(--vw-unit)); /* 调整最大高度 */
  box-shadow: 0 calc(-10 * var(--vw-unit)) calc(20 * var(--vw-unit)) rgba(0, 0, 0, 0.1);
  -webkit-overflow-scrolling: touch; /* 增加iOS滚动惯性 */
  z-index: 10;
}

.product-header {
  margin-bottom: calc(16 * var(--vw-unit));
}

.product-name {
  font-size: calc(24 * var(--vw-unit));
  font-weight: bold;
  margin: 0 0 calc(8 * var(--vw-unit));
  line-height: 1.3;
}

.product-desc {
  font-size: calc(14 * var(--vw-unit));
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* 价格部分 */
.price-section {
  display: flex;
  align-items: center;
  margin: calc(16 * var(--vw-unit)) 0;
  flex-wrap: wrap;
}

.current-price {
  font-size: calc(28 * var(--vw-unit));
  font-weight: bold;
  color: #ff5000;
  margin-right: calc(12 * var(--vw-unit));
}

.price-tag {
  padding: calc(2 * var(--vw-unit)) calc(8 * var(--vw-unit));
  background-color: #fff0e8;
  color: #ff5000;
  border: var(--border-width) solid #ffe0cc;
  border-radius: calc(4 * var(--vw-unit));
  font-size: calc(12 * var(--vw-unit));
  margin-right: calc(8 * var(--vw-unit));
}

.original-price {
  font-size: calc(14 * var(--vw-unit));
  color: #999;
  text-decoration: line-through;
  margin-top: calc(4 * var(--vw-unit));
  flex-basis: 100%;
}

/* 规格选择区 */
.specs-section {
  margin-top: calc(20 * var(--vw-unit));
}

.option-row {
  display: flex;
  margin-bottom: calc(20 * var(--vw-unit));
}

.option-label {
  width: calc(70 * var(--vw-unit));
  font-size: calc(16 * var(--vw-unit));
  font-weight: 500;
  color: #333;
  padding-top: calc(10 * var(--vw-unit));
  margin-right: calc(15 * var(--vw-unit));
}

.option-values {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: calc(10 * var(--vw-unit));
}

.option-value {
  flex: 0 0 calc((100% - 20 * var(--vw-unit)) / 3);
  padding: calc(10 * var(--vw-unit)) calc(5 * var(--vw-unit));
  font-size: calc(15 * var(--vw-unit));
  background-color: rgb(247, 247, 247);
  border-radius: calc(8 * var(--vw-unit));
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: visible;
  box-sizing: border-box;
  margin-bottom: calc(10 * var(--vw-unit));
}

.recommended-tag {
  position: absolute;
  top: calc(-12 * var(--vw-unit));
  left: 50%;
  transform: translateX(-50%);
  padding: calc(3 * var(--vw-unit)) calc(8 * var(--vw-unit));
  font-size: calc(10 * var(--vw-unit));
  border-radius: calc(4 * var(--vw-unit));
  background: linear-gradient(to right, rgb(241, 229, 215), rgb(232, 215, 197));
  color: rgb(117, 92, 77);
  white-space: nowrap;
  z-index: 2;
  box-shadow: 0 calc(1 * var(--vw-unit)) calc(3 * var(--vw-unit)) rgba(0, 0, 0, 0.1);
}

.option-value.active {
  background-color: rgb(235, 238, 255);
  color: rgb(0, 33, 170);
}

.section-title {
  font-size: calc(16 * var(--vw-unit));
  font-weight: bold;
  margin: calc(16 * var(--vw-unit)) 0 calc(12 * var(--vw-unit));
  color: #333;
}

/* 商品详情区 */
.product-details {
  margin-top: calc(24 * var(--vw-unit));
  padding-top: calc(16 * var(--vw-unit));
  border-top: var(--border-width) solid #f0f0f0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: calc(8 * var(--vw-unit)) 0;
  font-size: calc(14 * var(--vw-unit));
  border-bottom: var(--border-width) solid #f8f8f8;
}

.detail-label {
  color: #666;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.detail-notes {
  margin-top: calc(16 * var(--vw-unit));
  font-size: calc(12 * var(--vw-unit));
  color: #999;
  line-height: 1.6;
}

/* 底部购买栏 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: calc(12 * var(--vw-unit)) calc(16 * var(--vw-unit));
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 calc(-2 * var(--vw-unit)) calc(10 * var(--vw-unit)) rgba(0, 0, 0, 0.05);
  z-index: 10;
  height: calc(70 * var(--vw-unit));
  box-sizing: border-box;
}

.total-amount {
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: calc(12 * var(--vw-unit));
  color: #666;
}

.amount-value {
  font-size: calc(20 * var(--vw-unit));
  font-weight: bold;
  color: #ff5000;
}

.action-buttons {
  display: flex;
  gap: calc(12 * var(--vw-unit));
}

.cart-btn, .buy-btn {
  padding: calc(10 * var(--vw-unit)) calc(20 * var(--vw-unit));
  border-radius: calc(22 * var(--vw-unit));
  font-size: calc(15 * var(--vw-unit));
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.cart-btn {
  background-color: rgba(0, 33, 170, 0.1);
  color: rgb(0, 33, 170);
}

.buy-btn {
  background-color: rgb(0, 33, 170);
  color: white;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  width: calc(40 * var(--vw-unit));
  height: calc(40 * var(--vw-unit));
  border: calc(4 * var(--vw-unit)) solid #f3f3f3;
  border-top: calc(4 * var(--vw-unit)) solid rgb(0, 33, 170);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 提示消息 */
.toast-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: calc(12 * var(--vw-unit)) calc(20 * var(--vw-unit));
  border-radius: calc(8 * var(--vw-unit));
  font-size: calc(14 * var(--vw-unit));
  z-index: 1000;
  transition: opacity 0.3s;
}

.cup-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(12 * var(--vw-unit)) calc(12 * var(--vw-unit)) calc(8 * var(--vw-unit));
  min-width: calc(90 * var(--vw-unit));
  background-color: rgb(247, 247, 247);
  border-radius: calc(8 * var(--vw-unit));
}

.cup-option.active {
  background-color: rgb(235, 238, 255);
}

.cup-icon-container {
  margin-bottom: calc(6 * var(--vw-unit));
  width: calc(52 * var(--vw-unit));
  height: calc(52 * var(--vw-unit));
  background-color: rgb(235, 238, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(4 * var(--vw-unit));
}

.cup-icon {
  width: calc(36 * var(--vw-unit));
  height: calc(36 * var(--vw-unit));
}

.cup-text {
  font-size: calc(15 * var(--vw-unit));
  margin-top: calc(4 * var(--vw-unit));
  color: #333;
}

.cup-option.active .cup-text {
  color: rgb(0, 33, 170);
}

.tag-right {
  left: auto;
  right: calc(-10 * var(--vw-unit));
  transform: none;
}
</style>