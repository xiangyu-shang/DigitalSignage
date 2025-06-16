<template>
  <div class="category-list">
    <h3 class="category-title" v-text="'商品分类'"></h3>
    <ul class="categories">
      <li 
        v-for="category in categories" 
        :key="category.id" 
        :class="['category-item', { active: selectedCategory === category.id }]"
        @click="selectCategory(category.id)"
      >
        <span class="category-icon">
          <i :class="['icon', `icon-${category.icon}`]"></i>
        </span>
        <span class="category-name" v-text="category.name"></span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/product';
import { soundManager } from '@/utils/effects';

// 获取商品store
const productStore = useProductStore();

// 已选中的分类ID
const selectedCategory = computed(() => productStore.filters.categoryId);

// 商品分类列表
const categories = computed(() => [
  { id: null, name: '全部商品', icon: 'all' },
  ...productStore.categories
]);

// 分类加载状态
const loading = computed(() => productStore.categoriesLoading);

// 选择分类
function selectCategory(categoryId) {
  // 播放点击音效
  soundManager.play('click');
  
  // 更新过滤条件
  productStore.setFilters({ categoryId });
  
  // 重新加载商品列表
  productStore.loadProducts({ refresh: true });
}

// 组件挂载时加载分类数据
onMounted(async () => {
  await productStore.loadCategories();
});
</script>

<style scoped>
.category-list {
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.category-title {
  font-size: var(--font-size-medium);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.categories {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.category-item.active {
  background-color: var(--color-primary);
  color: white;
}

.category-icon {
  margin-right: var(--spacing-sm);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-name {
  font-size: var(--font-size-default);
}
</style> 