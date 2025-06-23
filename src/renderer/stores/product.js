import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchProducts, fetchProductById, fetchCategories } from '../utils/api';

/**
 * 商品状态管理
 */
export const useProductStore = defineStore('product', () => {
  // 商品列表
  const products = ref([]);
  
  // 商品分类
  const categories = ref([]);
  
  // 商品详情
  const currentProduct = ref(null);
  
  // 分类载入状态
  const categoriesLoading = ref(false);
  
  // 商品载入状态
  const productsLoading = ref(false);
  
  // 详情载入状态
  const productLoading = ref(false);
  
  // 搜索关键词
  const searchQuery = ref('');
  
  // 筛选条件
  const filters = ref({
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'default', // default, price-asc, price-desc, popularity
  });
  
  /**
   * 加载商品分类
   */
  async function loadCategories() {
    if (categories.value.length > 0) return;
    
    categoriesLoading.value = true;
    try {
      const data = await fetchCategories();
      categories.value = data;
    } catch (error) {
      console.error('Failed to load categories', error);
    } finally {
      categoriesLoading.value = false;
    }
  }
  
  /**
   * 加载商品列表
   * @param {Object} options - 加载选项
   * @param {boolean} options.refresh - 是否强制刷新
   */
  async function loadProducts(options = {}) {
    const { refresh = false } = options;
    
    // 如果已有数据且不强制刷新，则直接返回
    if (products.value.length > 0 && !refresh) return;
    
    productsLoading.value = true;
    try {
      const data = await fetchProducts({
        categoryId: filters.value.categoryId,
        search: searchQuery.value,
        minPrice: filters.value.minPrice,
        maxPrice: filters.value.maxPrice,
        sortBy: filters.value.sortBy,
      });
      products.value = data;
    } catch (error) {
      console.error('Failed to load product list', error);
    } finally {
      productsLoading.value = false;
    }
  }
  
  /**
   * 加载商品详情
   * @param {string} id - 商品ID
   */
  async function loadProductDetails(id) {
    if (currentProduct.value && currentProduct.value.id === id) return;
    
    productLoading.value = true;
    try {
      const data = await fetchProductById(id);
      currentProduct.value = data;
    } catch (error) {
      console.error(`Failed to load product details: ID ${id}`, error);
    } finally {
      productLoading.value = false;
    }
  }
  
  /**
   * 设置搜索关键词
   * @param {string} query - 搜索关键词
   */
  function setSearchQuery(query) {
    searchQuery.value = query;
  }
  
  /**
   * 设置筛选条件
   * @param {Object} newFilters - 筛选条件
   */
  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters };
  }
  
  /**
   * 重置筛选条件
   */
  function resetFilters() {
    filters.value = {
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      sortBy: 'default',
    };
    searchQuery.value = '';
  }
  
  // 根据筛选条件获取商品
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      let matches = true;
      
      // 搜索关键词筛选
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);
        matches = matches && (nameMatch || descMatch);
      }
      
      // 分类筛选
      if (filters.value.categoryId) {
        matches = matches && product.categoryId === filters.value.categoryId;
      }
      
      // 价格区间筛选
      if (filters.value.minPrice !== null) {
        matches = matches && product.price >= filters.value.minPrice;
      }
      if (filters.value.maxPrice !== null) {
        matches = matches && product.price <= filters.value.maxPrice;
      }
      
      return matches;
    }).sort((a, b) => {
      // 排序
      switch (filters.value.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });
  });
  
  return {
    products,
    categories,
    currentProduct,
    categoriesLoading,
    productsLoading,
    productLoading,
    searchQuery,
    filters,
    filteredProducts,
    loadCategories,
    loadProducts,
    loadProductDetails,
    setSearchQuery,
    setFilters,
    resetFilters,
  };
}); 