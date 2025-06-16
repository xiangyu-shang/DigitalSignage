<template>
  <div class="product-grid">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载商品中...</p>
    </div>
    <div v-else-if="products.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>未找到商品</h3>
      <p>请尝试其他搜索词或清除筛选条件</p>
      <button class="btn btn-secondary" @click="clearFilters">清除筛选条件</button>
    </div>
    <div v-else class="product-list">
      <product-card 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
        @click="gotoProductDetail(product.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { soundManager } from '@/utils/effects';
import ProductCard from '@/components/common/ProductCard.vue';

// 获取商品store
const productStore = useProductStore();
const router = useRouter();

// 商品数据
const products = computed(() => productStore.filteredProducts);

// 加载状态
const loading = computed(() => productStore.productsLoading);

// 跳转到产品详情页
function gotoProductDetail(productId) {
  // 播放点击音效
  soundManager.play('click');
  
  // 导航到详情页
  router.push({ name: 'Detail', params: { id: productId } });
}

// 清除筛选条件
function clearFilters() {
  // 播放点击音效
  soundManager.play('click');
  
  // 重置筛选条件
  productStore.resetFilters();
  
  // 重新加载商品
  productStore.loadProducts({ refresh: true });
}

// 组件挂载时加载商品数据
onMounted(async () => {
  await productStore.loadProducts();
});
</script>

<style scoped>
.product-grid {
  width: 100%;
  min-height: 300px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-md);
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-secondary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 100%;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.empty-state h3 {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-large);
}

.empty-state p {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-light);
}

/* 响应式调整 */
@media (max-width: 480px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .product-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 769px) {
  .product-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style> 