<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input 
        type="text" 
        class="search-input" 
        v-model="searchQuery"
        placeholder="搜索商品名称或关键词"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        <i class="icon icon-search"></i>
      </button>
    </div>
    <div class="search-filters">
      <div class="filter-group">
        <span class="filter-label">排序：</span>
        <div class="filter-options">
          <button 
            v-for="option in sortOptions" 
            :key="option.value"
            :class="['filter-option', { active: currentSortBy === option.value }]"
            @click="setSortBy(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useProductStore } from '@/stores/product';
import { soundManager } from '@/utils/effects';

// 获取商品store
const productStore = useProductStore();

// 搜索关键词
const searchQuery = ref('');

// 当前排序方式
const currentSortBy = computed(() => productStore.filters.sortBy || 'default');

// 排序选项
const sortOptions = [
  { label: '默认排序', value: 'default' },
  { label: '价格 ↑', value: 'price-asc' },
  { label: '价格 ↓', value: 'price-desc' },
  { label: '热门程度', value: 'popularity' }
];

// 初始化搜索关键词
searchQuery.value = productStore.searchQuery;

// 监听搜索关键词的变化，同步到store
watch(searchQuery, (newValue) => {
  // 自动搜索，可选功能
  // if (newValue === '') {
  //   handleSearch();
  // }
});

// 处理搜索
function handleSearch() {
  // 播放点击音效
  soundManager.play('click');
  
  // 设置搜索关键词
  productStore.setSearchQuery(searchQuery.value);
  
  // 刷新商品列表
  productStore.loadProducts({ refresh: true });
}

// 设置排序方式
function setSortBy(sortBy) {
  // 播放点击音效
  soundManager.play('click');
  
  // 设置排序方式
  productStore.setFilters({ sortBy });
  
  // 刷新商品列表
  productStore.loadProducts({ refresh: true });
}
</script>

<style scoped>
.search-bar {
  margin-bottom: var(--spacing-md);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  padding: var(--spacing-xs);
  box-shadow: var(--shadow-sm);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: var(--font-size-default);
  padding: var(--spacing-sm);
}

.search-button {
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  font-size: var(--font-size-default);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #2980b9;
}

.search-filters {
  display: flex;
  align-items: center;
  margin-top: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-right: var(--spacing-lg);
  margin-bottom: var(--spacing-xs);
}

.filter-label {
  font-size: var(--font-size-small);
  color: var(--color-text-light);
  margin-right: var(--spacing-sm);
}

.filter-options {
  display: flex;
  gap: var(--spacing-xs);
}

.filter-option {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-small);
  cursor: pointer;
  transition: all 0.3s;
}

.filter-option:hover {
  border-color: var(--color-secondary);
}

.filter-option.active {
  background-color: var(--color-secondary);
  color: white;
  border-color: var(--color-secondary);
}
</style> 