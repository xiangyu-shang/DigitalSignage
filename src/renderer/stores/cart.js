import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { soundManager } from '../utils/effects';

/**
 * 购物车状态管理
 */
export const useCartStore = defineStore('cart', () => {
  // 购物车商品列表
  const items = ref([]);
  
  // 保存购物车数据到本地存储
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value));
  };
  
  // 从本地存储加载购物车数据
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      items.value = JSON.parse(savedCart);
    }
  };
  
  // 加载购物车
  loadCart();
  
  /**
   * 添加商品到购物车
   * @param {Object} product - 商品对象
   * @param {string} product.id - 商品ID
   * @param {string} product.name - 商品名称
   * @param {number} product.price - 商品价格
   * @param {string} product.image - 商品图片
   * @param {Object} options - 商品选项，如颜色、尺寸等
   * @param {number} quantity - 商品数量
   */
  function addItem(product, options = {}, quantity = 1) {
    // 检查商品是否已存在于购物车中，并且选项相同
    const existingItemIndex = items.value.findIndex(item => 
      item.product.id === product.id && 
      JSON.stringify(item.options) === JSON.stringify(options)
    );
    
    if (existingItemIndex >= 0) {
      // 如果已存在，则增加数量
      items.value[existingItemIndex].quantity += quantity;
    } else {
      // 如果不存在，则添加新商品
      items.value.push({
        id: `${product.id}_${Date.now()}`, // 生成唯一ID
        product,
        options,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }
    
    // 播放添加音效
    soundManager.play('add');
    
    // 保存购物车
    saveCart();
  }
  
  /**
   * 从购物车移除商品
   * @param {string} itemId - 购物车项ID
   */
  function removeItem(itemId) {
    const index = items.value.findIndex(item => item.id === itemId);
    if (index >= 0) {
      items.value.splice(index, 1);
      
      // 播放移除音效
      soundManager.play('remove');
      
      // 保存购物车
      saveCart();
    }
  }
  
  /**
   * 更新购物车中商品的数量
   * @param {string} itemId - 购物车项ID
   * @param {number} quantity - 新数量
   */
  function updateQuantity(itemId, quantity) {
    const item = items.value.find(item => item.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity); // 确保数量至少为1
      
      // 保存购物车
      saveCart();
    }
  }
  
  /**
   * 清空购物车
   */
  function clearCart() {
    items.value = [];
    
    // 保存购物车
    saveCart();
  }
  
  // 计算商品总数
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });
  
  // 计算商品总价
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });
  
  // 是否有商品
  const hasItems = computed(() => items.value.length > 0);
  
  return {
    items,
    totalItems,
    totalPrice,
    hasItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}); 