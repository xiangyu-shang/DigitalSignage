<template>
  <div class="product-card" @click="$emit('click')">
    <div class="product-image-container">
      <img 
        :src="product.thumbnailImage || '/images/placeholder.png'" 
        :alt="product.name"
        class="product-image"
      />
      <span v-if="product.discount > 0" class="product-discount">
        {{ Math.round(product.discount * 100) }}% OFF
      </span>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-price">
        <div class="price-container">
          <span class="price-prefix">¥</span>
          <span class="current-price">{{ formatPrice(product.price) }}</span>
          <span class="price-suffix">一口价</span>
        </div>
        <div class="original-price-container" v-if="product.originalPrice && product.originalPrice > product.price">
          <span class="original-price">面价 ¥{{ formatPrice(product.originalPrice) }}</span>
        </div>
      </div>
      <div class="product-rating">
        <div class="stars">
          <span 
            v-for="i in 5" 
            :key="i" 
            :class="['star', { filled: i <= Math.round(product.rating) }]"
          >★</span>
        </div>
        <span class="reviews">({{ product.reviewCount }})</span>
      </div>
      <div class="add-to-cart-container">
        <button class="add-to-cart-button" @click.stop="addToCart">
          <span class="plus-icon">+</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useCartStore } from '@/stores/cart';
import { soundManager } from '@/utils/effects';

// 定义组件属性
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// 定义组件事件
defineEmits(['click']);

// 获取购物车store
const cartStore = useCartStore();

// 格式化价格
function formatPrice(price) {
  return price.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
}

// 添加到购物车
function addToCart(event) {
  // 阻止冒泡，避免触发卡片点击事件
  event.stopPropagation();
  
  // 播放添加音效
  soundManager.play('add');
  
  // 添加商品到购物车
  cartStore.addItem(props.product);
}
</script>

<style scoped>
.product-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.product-image-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 长宽比 */
  overflow: hidden;
  background-color: #f5f5f5;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-discount {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--color-accent);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: var(--font-size-small);
  font-weight: bold;
}

.product-info {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-default);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-xs);
}

.price-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.price-prefix {
  color: #ff5000;
  font-size: var(--font-size-small);
  margin-right: 2px;
}

.current-price {
  font-size: var(--font-size-medium);
  font-weight: bold;
  color: #ff5000;
}

.price-suffix {
  color: #ff5000;
  font-size: var(--font-size-small);
  margin-left: 4px;
}

.original-price-container {
  display: flex;
  align-items: center;
}

.original-price {
  font-size: var(--font-size-small);
  color: #999;
  text-decoration: line-through;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.stars {
  display: flex;
  margin-right: var(--spacing-xs);
}

.star {
  color: #ccc;
  font-size: var(--font-size-small);
}

.star.filled {
  color: #ffb800;
}

.reviews {
  font-size: var(--font-size-small);
  color: var(--color-text-light);
}

.add-to-cart-container {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.add-to-cart-button {
  width: 28px; /* 按钮宽度 */
  height: 28px; /* 按钮高度 */
  border-radius: 50%; /* 圆形边框 */
  background-color: rgb(0,33,170); /* 背景色-深蓝色(RGB 0,33,170) */
  border: none; /* 无边框 */
  color: white; /* 文字颜色-白色 */
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  cursor: pointer; /* 鼠标指针样式 */
  transition: transform 0.2s; /* 过渡动画效果 */
  box-shadow: 0 2px 4px rgba(0, 33, 170, 0.2); /* 阴影效果-深蓝色 */
}

.add-to-cart-button:hover {
  transform: scale(1.05);
}

.plus-icon {
  font-size: 16px;
  font-weight: 100;
  line-height: 1;
  position: relative;
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-icon::before,
.plus-icon::after {
  content: '';
  position: absolute;
  background-color: white;
}

.plus-icon::before {
  width: 14px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.plus-icon::after {
  width: 2px;
  height: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style> 