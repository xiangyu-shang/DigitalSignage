<template>
  <div class="cart-button" @click="goToCart">
    <div class="cart-icon">
      <i class="icon icon-cart"></i>
      <span v-if="totalItems > 0" class="cart-count">{{ totalItems }}</span>
    </div>
    <div class="cart-info">
      <div class="cart-label">购物车</div>
      <div class="cart-price">¥{{ formatPrice(totalPrice) }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { soundManager } from '@/utils/effects';

// 获取购物车store
const cartStore = useCartStore();
const router = useRouter();

// 购物车商品数量
const totalItems = computed(() => cartStore.totalItems);

// 购物车总价
const totalPrice = computed(() => cartStore.totalPrice);

// 格式化价格
function formatPrice(price) {
  return price.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
}

// 跳转到购物车页面
function goToCart() {
  // 播放点击音效
  soundManager.play('click');
  
  // 导航到结算页面
  router.push({ name: 'End' });
}
</script>

<style scoped>
.cart-button {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s;
}

.cart-button:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.cart-icon {
  position: relative;
  font-size: 24px;
  margin-right: var(--spacing-md);
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--color-accent);
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.cart-info {
  display: flex;
  flex-direction: column;
}

.cart-label {
  font-size: var(--font-size-small);
  color: var(--color-text-light);
}

.cart-price {
  font-size: var(--font-size-medium);
  font-weight: 600;
}
</style> 