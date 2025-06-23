<template>
  <div class="end-view">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="back-button" @click="goBack">
        <i class="back-icon"></i>
      </button>
      <h1 class="page-title">Confirm Order</h1>
      <div class="placeholder"></div>
    </div>
    
    <!-- 订单信息 -->
    <div class="order-container" ref="orderContainer">
      <!-- 配送信息 -->
      <div class="delivery-section">
        <div class="section-header">
          <i class="location-icon">📍</i>
          <h3 class="section-title">Delivery Information</h3>
        </div>
        
        <div class="delivery-info">
          <div class="store-info">
            <div class="store-name">Chenxi Industrial Park</div>
            <div class="store-distance">491m</div>
            <i class="arrow-icon">></i>
          </div>
          <div class="address">Xin'an Street, Bao'an District, Shenzhen, Guangdong</div>
          <div class="pickup-time">Estimated Pickup Time {{ getPickupTime() }}</div>
        </div>
      </div>
      
      <!-- 商品列表 -->
      <div class="products-section">
        <div class="section-header">
          <i class="product-icon">🛍️</i>
          <h3 class="section-title">Product Information</h3>
        </div>
        
        <div class="product-list" v-if="cartStore.items.length > 0">
          <div class="product-item" v-for="item in cartStore.items" :key="item.id">
            <div class="product-img-container">
              <div 
                class="product-img" 
                :style="{ backgroundColor: getCategoryColor(item.product.categoryId) }"
              >
                <img v-if="item.product.thumbnailImage" :src="getImageUrl(item.product.thumbnailImage)" class="product-thumbnail" alt="Product Image">
                <span v-else>{{ item.product.name.substring(0, 2) }}</span>
              </div>
            </div>
            <div class="product-info">
              <div class="product-title-row">
                <h4 class="product-name">{{ item.product.name }}{{ item.options.size === 'Large 16oz' ? ' (Large Cup)' : '' }}</h4>
                <div class="product-price">¥{{ item.product.price }}</div>
              </div>
              
              <div class="product-details-row">
                <div class="product-specs">
                  {{ formatProductOptions(item.options) }}
                </div>
                <div class="product-original-price" v-if="item.product.originalPrice > item.product.price">¥{{ item.product.originalPrice }}</div>
              </div>
              
              <div class="product-price-row">
                <div class="coupon-tag">After Coupon</div>
                <div class="product-quantity">×{{ item.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-cart" v-else>
          <p>Cart is Empty</p>
        </div>
      </div>
      
      <!-- 优惠信息 -->
      <div class="discount-section">
        <div class="section-header">
          <i class="discount-icon">🏷️</i>
          <h3 class="section-title">Discount Information</h3>
        </div>
        
        <div class="discount-item">
          <div class="discount-name">
            <span>Coupons</span>
            <span class="discount-count">3 Available</span>
          </div>
          <div class="discount-action">
            <span class="discount-value">-¥5</span>
            <i class="arrow-icon">></i>
          </div>
        </div>
        
        <div class="discount-item">
          <div class="discount-name">
            <span>Points</span>
            <span class="points-available">200 Available</span>
          </div>
          <div class="discount-action">
            <span class="points-value">-¥2</span>
            <i class="arrow-icon">></i>
          </div>
        </div>
      </div>
      
      <!-- 支付方式 -->
      <div class="payment-section">
        <div class="section-header">
          <i class="payment-icon">💳</i>
          <h3 class="section-title">Payment Method</h3>
        </div>
        
        <div class="payment-options">
          <div 
            class="payment-option" 
            :class="{ active: selectedPayment === 'wechat' }"
            @click="setPaymentMethod('wechat')"
          >
            <div class="payment-option-left">
              <i class="payment-logo wechat-pay">WeChat</i>
              <span>WeChat Pay</span>
            </div>
            <i class="check-icon" :class="{ hidden: selectedPayment !== 'wechat' }">✓</i>
          </div>
          
          <div 
            class="payment-option"
            :class="{ active: selectedPayment === 'alipay' }"
            @click="setPaymentMethod('alipay')"
          >
            <div class="payment-option-left">
              <i class="payment-logo alipay">Alipay</i>
              <span>Alipay</span>
            </div>
            <i class="check-icon" :class="{ hidden: selectedPayment !== 'alipay' }">✓</i>
          </div>
          
          <div 
            class="payment-option"
            :class="{ active: selectedPayment === 'card' }"
            @click="setPaymentMethod('card')"
          >
            <div class="payment-option-left">
              <i class="payment-logo card-pay">Card</i>
              <span>Card Payment</span>
            </div>
            <i class="check-icon" :class="{ hidden: selectedPayment !== 'card' }">✓</i>
          </div>
        </div>
      </div>
      
      <!-- 订单备注 -->
      <div class="remarks-section">
        <div class="section-header">
          <i class="remarks-icon">📝</i>
          <h3 class="section-title">Order Notes</h3>
        </div>
        
        <div class="remarks-input-container">
          <input 
            type="text" 
            class="remarks-input" 
            placeholder="You can fill in your special requirements (optional)" 
            v-model="remarks"
          />
        </div>
      </div>
    </div>
    
    <!-- 底部结算栏 -->
    <div class="checkout-bar">
      <div class="price-info">
        <div class="total-price">Total: <span class="price-value">¥{{ cartStore.totalPrice.toFixed(2) }}</span></div>
        <div class="discount-info" v-if="totalDiscount > 0">Discounted: ¥{{ totalDiscount.toFixed(2) }}</div>
      </div>
      <button 
        class="checkout-btn" 
        @click="submitOrder"
        :class="{ 'disabled': cartStore.items.length === 0 }"
      >
        Place Order
      </button>
    </div>
    
    <!-- 支付成功浮层 -->
    <div class="payment-success-modal" v-if="paymentSuccess">
      <div class="modal-content">
        <div class="success-icon">✓</div>
        <h2 class="success-title">Payment Successful</h2>
        <p class="success-message">Your order has been submitted, please pick up your order with the order number</p>
        <div class="order-number">Order Number: {{ orderNumber }}</div>
        <button class="close-btn" @click="closeSuccessModal">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { getImageUrl } from '../assets/local-images';

const router = useRouter();
const cartStore = useCartStore();
const remarks = ref('');
const paymentSuccess = ref(false);
const selectedPayment = ref('wechat');

// 返回上一页
function goBack() {
  router.go(-1);
}

// 计算总优惠金额
const totalDiscount = computed(() => {
  let originalTotal = 0;
  cartStore.items.forEach(item => {
    if (item.product.originalPrice > item.product.price) {
      originalTotal += (item.product.originalPrice - item.product.price) * item.quantity;
    }
  });
  return originalTotal;
});

// 设置支付方式
function setPaymentMethod(method) {
  selectedPayment.value = method;
}

// 提交订单
function submitOrder() {
  if (cartStore.items.length === 0) {
    alert('Cart is empty, please add items first');
    return;
  }
  
  // 显示支付成功弹窗
  paymentSuccess.value = true;
  
  // 可以在此处添加API调用以提交订单数据
}

// 关闭支付成功弹窗并返回菜单页
function closeSuccessModal() {
  paymentSuccess.value = false;
  
  // 清空购物车
  cartStore.clearCart();
  
  // 返回菜单页
  router.push({ name: 'Menu' });
}

// 生成订单号
const orderNumber = ref(generateOrderNumber());
function generateOrderNumber() {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return timestamp + random;
}

// 组件挂载时检查购物车
onMounted(() => {
  if (cartStore.items.length === 0) {
    // 如果购物车为空，显示提示并返回菜单页
    setTimeout(() => {
      alert('Cart is empty, please add items first');
      router.push({ name: 'Menu' });
    }, 100);
  }
  
  // 设置正常滚动
  setupScrolling();
});

// 设置正常滚动功能
function setupScrolling() {
  const orderContainer = document.querySelector('.order-container');
  if (!orderContainer) return;
  
  // 确保订单容器可以正常滚动
  orderContainer.style.overflowY = 'auto';
  orderContainer.style.webkitOverflowScrolling = 'touch';
  
  // 添加触摸事件处理，防止冲突
  document.body.style.overflow = 'hidden'; // 防止body滚动
  
  // 移除任何可能阻止滚动的事件监听器
  orderContainer.addEventListener('touchmove', (e) => {
    e.stopPropagation();
  }, { passive: true });
}

// 格式化商品选项，用斜杠分隔
function formatProductOptions(options) {
  if (!options) return '';
  
  const optionValues = [];
  if (options.size) {
    // 处理尺寸显示
    if (options.size === 'Large 16oz') {
      optionValues.push('Large 16oz');
    } else {
      optionValues.push(options.size);
    }
  }
  
  if (options.temp) {
    // 处理温度显示
    if (options.temp === 'Iced') {
      optionValues.push('Iced');
    } else if (options.temp === 'Hot') {
      optionValues.push('Hot');
    } else {
      optionValues.push(options.temp);
    }
  }
  
  if (options.sugar) {
    // 处理糖度显示
    const sugarMap = {
      'Standard': 'Standard',
      'Less Sweet': 'Less Sweet',
      'Slightly Sweet': 'Slightly Sweet',
      'Lightly Sweet': 'Lightly Sweet',
      'No Added Sugar': 'No Added Sugar'
    };
    optionValues.push(sugarMap[options.sugar] || options.sugar);
  }
  
  if (options.milk) {
    // 处理奶基显示
    const milkMap = {
      'Whole Milk': 'Whole Milk',
      'Oat Milk': 'Oat Milk'
    };
    optionValues.push(milkMap[options.milk] || options.milk);
  }
  
  if (options.extras && options.extras.length > 0) {
    optionValues.push(options.extras.join('/'));
  }
  
  return optionValues.join(' / ');
}
</script>

<style scoped>
.end-view {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使用固定高度而非min-height */
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden; /* 防止整个视图滚动 */
}

/* 顶部状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(4 * var(--vw-unit)) calc(16 * var(--vw-unit));
  background-color: white;
  font-size: calc(12 * var(--vw-unit));
  height: calc(24 * var(--vw-unit));
  box-sizing: border-box;
}

.status-right {
  display: flex;
  gap: calc(8 * var(--vw-unit));
}

/* 导航栏 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(12 * var(--vw-unit)) calc(16 * var(--vw-unit));
  background-color: rgb(245,245,245);
  border-bottom: var(--border-width) solid #f0f0f0;
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

.page-title {
  font-size: calc(18 * var(--vw-unit));
  font-weight: bold;
  margin: 0;
}

.placeholder {
  width: calc(32 * var(--vw-unit));
}

/* 订单容器 */
.order-container {
  flex: 1;
  padding-bottom: calc(70 * var(--vw-unit));
  overflow-y: scroll; /* 改为scroll强制显示滚动 */
  -webkit-overflow-scrolling: touch; /* 增加iOS滚动惯性 */
  height: calc(100vh - 126 * var(--vw-unit)); /* 减去导航栏和底部结算栏的高度 */
  position: relative; /* 确保定位上下文 */
  z-index: 1; /* 确保在其他元素之上 */
}

/* 通用部分样式 */
.section-header {
  display: flex;
  align-items: center;
  padding: calc(12 * var(--vw-unit)) calc(16 * var(--vw-unit));
  border-bottom: var(--border-width) solid #f0f0f0;
}

.section-title {
  font-size: calc(16 * var(--vw-unit));
  font-weight: bold;
  margin: 0 0 0 calc(8 * var(--vw-unit));
}

/* 配送信息 */
.delivery-section {
  margin-top: calc(12 * var(--vw-unit));
  background-color: white;
  border-radius: calc(8 * var(--vw-unit));
  overflow: hidden;
}

.delivery-info {
  padding: calc(16 * var(--vw-unit));
}

.store-info {
  display: flex;
  align-items: center;
  margin-bottom: calc(8 * var(--vw-unit));
}

.store-name {
  font-size: calc(16 * var(--vw-unit));
  font-weight: 500;
}

.store-distance {
  font-size: calc(14 * var(--vw-unit));
  color: #999;
  margin-left: calc(8 * var(--vw-unit));
}

.arrow-icon {
  margin-left: auto;
  color: #999;
  font-size: calc(12 * var(--vw-unit));
}

.address {
  font-size: calc(14 * var(--vw-unit));
  color: #666;
  margin-bottom: calc(8 * var(--vw-unit));
}

.pickup-time {
  font-size: calc(14 * var(--vw-unit));
  color: #0055ff;
}

/* 商品列表 */
.products-section {
  margin-top: calc(12 * var(--vw-unit));
  background-color: white;
  border-radius: calc(8 * var(--vw-unit));
  overflow: hidden;
}

.product-list {
  padding: 0;
}

.product-item {
  display: flex;
  padding: calc(16 * var(--vw-unit));
  border-bottom: var(--border-width) solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-img-container {
  margin-right: calc(12 * var(--vw-unit));
}

.product-img {
  width: calc(60 * var(--vw-unit));
  height: calc(60 * var(--vw-unit));
  border-radius: calc(8 * var(--vw-unit));
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(16 * var(--vw-unit));
  color: #333;
  overflow: hidden;
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center; /* 确保图片居中显示 */
}

.product-img-1 {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23ffedd0"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%23ff6b00" text-anchor="middle" dominant-baseline="middle">果蔬茶</text></svg>');
}

.product-img-2 {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23e8f5e9"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%23388e3c" text-anchor="middle" dominant-baseline="middle">栀子花香</text></svg>');
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: calc(6 * var(--vw-unit));
}

.product-name {
  font-size: calc(17 * var(--vw-unit));
  font-weight: bold;
  margin: 0;
  color: #333;
  flex: 1;
}

.product-price {
  font-size: calc(17 * var(--vw-unit));
  font-weight: bold;
  color: #ff5000;
  white-space: nowrap;
  margin-left: calc(8 * var(--vw-unit));
}

.product-details-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: calc(6 * var(--vw-unit));
}

.product-specs {
  font-size: calc(13 * var(--vw-unit));
  color: #888;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-original-price {
  font-size: calc(13 * var(--vw-unit));
  color: #999;
  text-decoration: line-through;
  margin-left: calc(8 * var(--vw-unit));
}

.product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-tag {
  font-size: calc(14 * var(--vw-unit));
  color: #ff5000;
  border: var(--border-width) solid #ff5000;
  border-radius: calc(3 * var(--vw-unit));
  padding: calc(2 * var(--vw-unit)) calc(6 * var(--vw-unit));
}

.product-quantity {
  font-size: calc(14 * var(--vw-unit));
  color: #999;
}

/* 优惠信息 */
.discount-section {
  margin-top: calc(12 * var(--vw-unit));
  background-color: white;
  border-radius: calc(8 * var(--vw-unit));
  overflow: hidden;
}

.discount-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(16 * var(--vw-unit));
  border-bottom: var(--border-width) solid #f0f0f0;
}

.discount-item:last-child {
  border-bottom: none;
}

.discount-name {
  display: flex;
  align-items: center;
  font-size: calc(15 * var(--vw-unit));
  color: #333;
}

.discount-count, .points-available {
  font-size: calc(12 * var(--vw-unit));
  color: #ff5000;
  margin-left: calc(8 * var(--vw-unit));
  background-color: #fff0e8;
  padding: calc(2 * var(--vw-unit)) calc(6 * var(--vw-unit));
  border-radius: calc(10 * var(--vw-unit));
}

.discount-action {
  display: flex;
  align-items: center;
}

.discount-value, .points-value {
  font-size: calc(15 * var(--vw-unit));
  color: #ff5000;
  margin-right: calc(8 * var(--vw-unit));
}

/* 支付方式 */
.payment-section {
  margin-top: calc(12 * var(--vw-unit));
  background-color: white;
  border-radius: calc(8 * var(--vw-unit));
  overflow: hidden;
}

.payment-options {
  padding: 0;
}

.payment-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(16 * var(--vw-unit));
  border-bottom: var(--border-width) solid #f0f0f0;
  cursor: pointer;
}

.payment-option:last-child {
  border-bottom: none;
}

.payment-option-left {
  display: flex;
  align-items: center;
}

.payment-logo {
  width: calc(24 * var(--vw-unit));
  height: calc(24 * var(--vw-unit));
  margin-right: calc(12 * var(--vw-unit));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(4 * var(--vw-unit));
  font-size: calc(12 * var(--vw-unit));
  color: white;
}

.wechat-pay {
  background-color: #07C160;
}

.alipay {
  background-color: #1677FF;
}

.card-pay {
  background-color: #FF6C00;
}

.payment-option-left span {
  font-size: calc(15 * var(--vw-unit));
}

.check-icon {
  color: rgb(0, 33, 170);
  font-size: calc(16 * var(--vw-unit));
}

.check-icon.hidden {
  visibility: hidden;
}

/* 订单备注 */
.remarks-section {
  margin-top: calc(12 * var(--vw-unit));
  background-color: white;
  border-radius: calc(8 * var(--vw-unit));
  overflow: hidden;
  margin-bottom: calc(12 * var(--vw-unit));
}

.remarks-input-container {
  padding: calc(16 * var(--vw-unit));
}

.remarks-input {
  width: 100%;
  border: var(--border-width) solid #e0e0e0;
  border-radius: calc(8 * var(--vw-unit));
  padding: calc(12 * var(--vw-unit));
  font-size: calc(14 * var(--vw-unit));
  color: #333;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.remarks-input::placeholder {
  color: #999;
}

/* 底部结算栏 */
.checkout-bar {
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

.price-info {
  display: flex;
  flex-direction: column;
}

.total-price {
  font-size: calc(14 * var(--vw-unit));
  color: #333;
}

.price-value {
  font-size: calc(18 * var(--vw-unit));
  font-weight: bold;
  color: #ff5000;
}

.discount-info {
  font-size: calc(12 * var(--vw-unit));
  color: #999;
  margin-top: calc(2 * var(--vw-unit));
}

.checkout-btn {
  background-color: rgb(0, 33, 170);
  color: white;
  border: none;
  border-radius: calc(22 * var(--vw-unit));
  padding: calc(12 * var(--vw-unit)) calc(24 * var(--vw-unit));
  font-size: calc(16 * var(--vw-unit));
  font-weight: bold;
  cursor: pointer;
}

.checkout-btn.disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.8;
}

/* 支付成功浮层 */
.payment-success-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: calc(12 * var(--vw-unit));
  width: 80%;
  max-width: calc(320 * var(--vw-unit));
  padding: calc(24 * var(--vw-unit));
  text-align: center;
  box-shadow: 0 calc(4 * var(--vw-unit)) calc(20 * var(--vw-unit)) rgba(0, 0, 0, 0.2);
}

.success-icon {
  width: calc(60 * var(--vw-unit));
  height: calc(60 * var(--vw-unit));
  border-radius: 50%;
  background-color: #07C160;
  color: white;
  font-size: calc(36 * var(--vw-unit));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto calc(16 * var(--vw-unit));
}

.success-title {
  font-size: calc(20 * var(--vw-unit));
  font-weight: bold;
  margin: 0 0 calc(12 * var(--vw-unit));
  color: #333;
}

.success-message {
  font-size: calc(14 * var(--vw-unit));
  color: #666;
  margin: 0 0 calc(16 * var(--vw-unit));
}

.order-number {
  font-size: calc(16 * var(--vw-unit));
  font-weight: bold;
  color: #333;
  background-color: #f5f5f5;
  padding: calc(12 * var(--vw-unit));
  border-radius: calc(8 * var(--vw-unit));
  margin: 0 0 calc(24 * var(--vw-unit));
}

.close-btn {
  background-color: rgb(0, 33, 170);
  color: white;
  border: none;
  border-radius: calc(22 * var(--vw-unit));
  padding: calc(12 * var(--vw-unit)) calc(24 * var(--vw-unit));
  font-size: calc(16 * var(--vw-unit));
  font-weight: bold;
  cursor: pointer;
  width: 80%;
  margin: 0 auto;
}

/* 空购物车提示 */
.empty-cart {
  padding: calc(40 * var(--vw-unit)) 0;
  text-align: center;
  color: #999;
  font-size: calc(14 * var(--vw-unit));
}

/* 活跃支付方式 */
.payment-option.active {
  background-color: rgba(0, 33, 170, 0.05);
}
</style>

<script>
// 获取预计取餐时间
function getPickupTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 20); // 假设20分钟后可取餐
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
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
</script> 