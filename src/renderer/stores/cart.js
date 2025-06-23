import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { soundManager } from '../utils/effects';

/**
 * 购物车状态管理
 */
export const useCartStore = defineStore('cart', () => {
  // 购物车项目
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
   * @param {Object} options - 商品选项
   * @param {number} quantity - 数量
   */
  function addItem(product, options = {}, quantity = 1) {
    // 判断是否已存在相同商品和选项
    const existingIndex = items.value.findIndex(item => {
      return (
        item.product.id === product.id && 
        item.options.size === options.size &&
        item.options.temp === options.temp &&
        item.options.sugar === options.sugar &&
        item.options.milk === options.milk
      );
    });
    
    // 如果已存在，增加数量
    if (existingIndex !== -1) {
      items.value[existingIndex].quantity += quantity;
    } else {
      // 否则添加新项目
      items.value.push({
        id: Date.now().toString(), // 生成唯一ID
        product: { ...product },
        options: { ...options },
        quantity
      });
    }
    
    // 播放添加音效
    soundManager.play('add');
    
    // 保存购物车
    saveCart();
  }
  
  /**
   * 从购物车移除指定项目
   * @param {string} itemId - 项目ID
   */
  function removeItem(itemId) {
    const index = items.value.findIndex(item => item.id === itemId);
    if (index !== -1) {
      items.value.splice(index, 1);
      
      // 播放移除音效
      soundManager.play('remove');
      
      // 保存购物车
      saveCart();
    }
  }
  
  /**
   * 更新商品数量
   * @param {string} itemId - 项目ID
   * @param {number} quantity - 新数量
   */
  function updateQuantity(itemId, quantity) {
    const item = items.value.find(item => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        // 如果数量小于等于0，移除该项目
        removeItem(itemId);
      } else {
        item.quantity = quantity;
      }
      
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
  
  /**
   * 计算购物车中商品总数量
   */
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });
  
  /**
   * 计算购物车总价
   */
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      let itemPrice = item.product.price;
      
      // 根据选项调整价格
      if (item.options) {
        // 如果选择燕麦奶，价格可能会有调整
        if (item.options.milk === 'Oat Milk') {
          itemPrice += 2; // 假设燕麦奶比纯牛奶贵2元
        }
        
        // 其他可能的价格调整...
      }
      
      return sum + (itemPrice * item.quantity);
    }, 0);
  });
  
  /**
   * 判断购物车是否有商品
   */
  const hasItems = computed(() => {
    return items.value.length > 0;
  });
  
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    hasItems
  };
}); 