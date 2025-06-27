<template>
  <div class="menu-view" :class="themeStore.currentThemeId + '-theme'">
    <!-- Logo顶部栏 -->
    <div class="logo-header">
      <div class="logo-container">
        <img src="/images/Rusin网站LOGO.png" alt="Rusin Display" class="logo-image" />
      </div>
      <!-- 功能按钮区移至此处 -->
      <div class="func-buttons header-buttons">
        <button class="more-btn" @click="openSignagePanel">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="12" r="2.2" class="dots-icon"/>
            <circle cx="12" cy="12" r="3.2" class="dots-icon"/>
            <circle cx="20" cy="12" r="2.2" class="dots-icon"/>
          </svg>
        </button>
        <div class="button-divider"></div>
        <button class="scan-btn">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" class="scan-icon-bg"/>
            <circle cx="12" cy="12" r="5" class="scan-icon-circle" stroke-width="4" fill="none"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <!-- 自提/外送切换 -->
      <div class="delivery-toggle">
        <button 
          class="toggle-btn" 
          :class="{ active: themeStore.currentThemeId === 'default' }"
          @click="setTheme('default')"
        >Pick&nbsp;Up</button>
        <button 
          class="toggle-btn" 
          :class="{ active: themeStore.currentThemeId === 'alternate' }"
          @click="setTheme('alternate')"
        >Delivery</button>
      </div>

      <!-- 搜索框 -->
      <div class="search-container">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#666666"/>
        </svg>
        <input type="text" class="search-input" placeholder="Light Fruit Tea 🍃" />
      </div>

      <!-- 功能按钮区移至顶部栏 -->
    </div>

    <!-- 数字标牌系统方框 - 默认隐藏，鼠标悬停时显示 -->
    <div class="digital-signage-panel" :class="{ closed: isPanelClosed, 'force-open': isPanelForceOpen }">
      <div class="panel-header">
        <span>Digital Signage System</span>
        <button class="close-btn" @click="closeSignagePanel">×</button>
      </div>
      <div class="panel-content">
        <div class="panel-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="12" rx="2" stroke="#333" stroke-width="2"/>
            <path d="M7 20H17" stroke="#333" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 16V20" stroke="#333" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Screen Management</span>
        </div>
        <div class="panel-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          <span>Content Distribution</span>
        </div>
        <div class="panel-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 3.75H3.75V10.5H10.5V3.75Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.25 3.75H13.5V10.5H20.25V3.75Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.5 13.5H3.75V20.25H10.5V13.5Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.25 13.5H13.5V20.25H20.25V13.5Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Template Design</span>
        </div>
        <div class="panel-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>System Settings</span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 侧边分类菜单 -->
      <div class="category-sidebar">
        <ul class="category-list">
          <li 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-item', { active: currentCategoryId === category.id }]"
            @click="selectCategory(category.id)"
          >
            <div class="category-logo"></div>
            <span :data-text-length="getTextLengthClass(category.name)">{{ formatCategoryName(category.name) }}</span>
          </li>
        </ul>
      </div>

      <!-- 右侧产品展示区 -->
      <div class="product-display">
        <!-- 加载中状态 -->
        <div class="loading-container" v-if="productStore.productsLoading">
          <div class="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
        <!-- 没有商品状态 -->
        <div class="empty-state" v-else-if="filteredProducts.length === 0">
          <p>No products in this category</p>
        </div>
        <!-- 展示商品列表 -->
        <template v-else>
          <!-- 商品列表 -->
          <div class="product-list">
            <!-- 分区标题 -->
            <div class="section-title">{{ currentCategory ? currentCategory.name : 'New Seasonal Products' }}</div>
            
            <!-- 商品项 -->
            <div 
              class="product-item" 
              v-for="product in filteredProducts" 
              :key="product.id"
              @click="viewProductDetail(product.id)"
            >
              <div class="product-tag" v-if="product.discount > 0.1">New</div>
              <div 
                class="product-img" 
                :style="{
                  'background-color': getCategoryColor(product.categoryId)
                }"
              >
                <img 
                  v-if="product.thumbnailImage" 
                  :src="getImageUrl(product.thumbnailImage)" 
                  class="product-thumbnail" 
                  alt="Product Image"
                  @error="(e) => handleImageError(e, product)"
                  :data-product-id="product.id"
                  :data-image-path="product.thumbnailImage"
              >
                <span v-else>{{ product.name.substring(0, 6) }}</span>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-desc">{{ product.description.substring(0, 30) }}...</p>
                <div class="product-price-row">
                  <div class="price-column">
                    <div class="price-info">
                      <span class="price-prefix">¥</span>
                      <span class="price">{{ product.price.toFixed(1) }}</span>
                      <span class="price-suffix">Fixed Price</span>
                    </div>
                    <div class="original-price" v-if="product.originalPrice > product.price">
                      <span>Original ¥{{ product.originalPrice }}</span>
                    </div>
                  </div>
                  <div class="cart-control">
                    <button class="add-cart-btn" >
                      <span class="plus-icon">+</span>
                      <!-- 商品数量显示 -->
                      <span class="item-count-bubble" v-if="getProductQuantity(product.id) > 0">{{ getProductQuantity(product.id) }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="checkout-bar">
      <div class="cart-info" :data-count="cartStore.totalItems">
        <span class="total-price" v-if="cartStore.hasItems">Estimated Total<span>¥{{ formatPrice(cartStore.totalPrice) }}</span></span>
        <span class="total-price" v-else>Cart is Empty</span>
        <span class="discount-info" v-if="cartStore.hasItems && calculatedDiscount > 0">Already enjoying lower discounts, total savings ¥{{ formatPrice(calculatedDiscount) }}</span>
      </div>
      <button 
        class="checkout-btn" 
        @click="goToCheckout" 
        :class="{ 'disabled': !cartStore.hasItems }"
      >
        {{ cartStore.hasItems ? 'Checkout' : 'Add Items to Cart' }}
      </button>
    </div>

    <!-- 底部导航栏 -->
    <!-- <div class="tab-bar">
      <div class="tab-item">
        <i class="tab-icon home-icon"></i>
        <span>Home</span>
      </div>
      <div class="tab-item active">
        <i class="tab-icon order-icon"></i>
        <span>Menu</span>
      </div>
      <div class="tab-item">
        <i class="tab-icon mall-icon"></i>
        <span>E-commerce</span>
      </div>
      <div class="tab-item">
        <i class="tab-icon card-icon"></i>
        <span>Membership Card</span>
      </div>
      <div class="tab-item">
        <i class="tab-icon me-icon"></i>
        <span>Me</span>
      </div>
    </div> -->

    <!-- 添加动态SVG样式元素，用于主题切换时更新SVG颜色 -->
    <div style="display:none">
      <svg id="svgDefs"></svg>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from 'vue';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';
import { useThemeStore } from '@/stores/theme';
import { useRouter } from 'vue-router';
import { initEffects } from '@/utils/effects';
import { getImageUrl, setupImageFallback, getImageLoadReport } from '../assets/local-images';

// 获取商品store
const productStore = useProductStore();
const cartStore = useCartStore();
const themeStore = useThemeStore();
const router = useRouter();

// 当前选中的分类ID
const currentCategoryId = ref(null);

// 控制数字标牌系统面板的显示
const isPanelClosed = ref(false);
const isPanelForceOpen = ref(false);

// 调试UI显示控制
const showDebugUI = ref(true);
const showThemeDebugPanel = ref(false);

// 获取分类列表
const categories = computed(() => productStore.categories);

// 获取经过过滤的商品列表
const filteredProducts = computed(() => productStore.filteredProducts);

// 获取当前分类
const currentCategory = computed(() => {
  if (!currentCategoryId.value) return null;
  return categories.value.find(c => c.id === currentCategoryId.value);
});

// 添加商品到购物车
function addToCart(product) {
  cartStore.addItem(product);
  // 播放添加音效
  if (window.soundManager) {
    window.soundManager.play('add');
  }
}

// 获取购物车中商品数量
function getProductQuantity(productId) {
  return cartStore.items.reduce((sum, item) => {
    if (item.product.id === productId) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);
}

// 选择分类
function selectCategory(categoryId) {
  // 处理特殊分类 - Contact Us
  if (categoryId === 'contact') {
    router.push({ name: 'Contact' });
    return;
  }
  
  currentCategoryId.value = categoryId;
  productStore.setFilters({ categoryId });
  productStore.loadProducts({ refresh: true });
}

// 查看商品详情
function viewProductDetail(productId) {
  router.push({ 
    name: 'Detail', 
    params: { id: productId } 
  });
}

// 去结算
function goToCheckout() {
  if (cartStore.totalItems > 0) {
    router.push({ name: 'End' });
  }
}

// 根据分类ID获取背景色
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

// 计算总优惠金额
const calculatedDiscount = computed(() => {
  let originalTotal = 0;
  cartStore.items.forEach(item => {
    if (item.product.originalPrice > item.product.price) {
      originalTotal += (item.product.originalPrice - item.product.price) * item.quantity;
    }
  });
  return originalTotal;
});

// 打开面板
function openSignagePanel() {
  isPanelClosed.value = false;
  isPanelForceOpen.value = true;
  
  // 3秒后恢复正常悬停逻辑
  setTimeout(() => {
    isPanelForceOpen.value = false;
  }, 3000);
}

// 关闭面板
function closeSignagePanel() {
  isPanelClosed.value = true;
  isPanelForceOpen.value = false;
  
  // 5分钟后重置面板状态，允许再次显示
  setTimeout(() => {
    isPanelClosed.value = false;
  }, 300000); // 5分钟 = 300,000毫秒
}

// 设置主题
function setTheme(themeId) {
  console.log(`[MenuView] 设置主题: ${themeId}`);
  themeStore.setTheme(themeId);
  
  // 延迟更新SVG元素的颜色
  setTimeout(updateSvgColors, 100);
}

// 更新SVG元素的颜色
function updateSvgColors() {
  console.log('[MenuView] 更新SVG元素颜色');
  
  try {
    // 获取当前主题ID
    const currentThemeId = themeStore.currentThemeId;
    console.log(`[MenuView] 当前主题: ${currentThemeId}`);

    // 添加延迟，确保主题变量已经应用
    setTimeout(() => {
      // 1. 处理特定SVG路径元素
      const svgPaths = {
        // 蓝色系颜色
        blue: {
          fill: ['#0039ac', '#003cc8', '#003399'],
          stroke: ['#0039ac', '#003cc8', '#003399']
        },
        // 橙色系颜色
        orange: {
          fill: ['#ff5000', '#cc4000', '#992f00'],
          stroke: ['#ff5000', '#cc4000', '#992f00']
        }
      };
      
      // 获取当前主题对应的颜色变量
      const root = document.documentElement;
      const blueButtonColor = getComputedStyle(root).getPropertyValue('--color-blueButton').trim();
      const blueButtonDarkColor = getComputedStyle(root).getPropertyValue('--color-blueButtonDark').trim();
      
      console.log(`[MenuView] 当前主题颜色变量: blueButton=${blueButtonColor}, blueButtonDark=${blueButtonDarkColor}`);
      
      // 处理填充颜色
      const targetFillColors = currentThemeId === 'default' ? svgPaths.blue.fill : svgPaths.orange.fill;
      targetFillColors.forEach(color => {
        document.querySelectorAll(`svg path[fill="${color}"]`).forEach(path => {
          path.classList.add('svg-blue-dark-fill');
          console.log(`[MenuView] 添加填充类: ${color} -> svg-blue-dark-fill`);
        });
      });
      
      // 处理描边颜色
      const targetStrokeColors = currentThemeId === 'default' ? svgPaths.blue.stroke : svgPaths.orange.stroke;
      targetStrokeColors.forEach(color => {
        document.querySelectorAll(`svg path[stroke="${color}"]`).forEach(path => {
          path.classList.add('svg-blue-dark-stroke');
          console.log(`[MenuView] 添加描边类: ${color} -> svg-blue-dark-stroke`);
        });
      });
      
      // 2. 强制刷新SVG过滤器
      document.querySelectorAll('.svg-dynamic-color').forEach(el => {
        el.classList.remove('svg-dynamic-color');
        // 使用setTimeout确保DOM有时间处理这些变化
        setTimeout(() => {
          el.classList.add('svg-dynamic-color');
          console.log('[MenuView] 刷新动态颜色元素');
        }, 10);
      });
      
      // 3. 更新购物车图标颜色 (使用background-image中的SVG)
      const cartInfoElements = document.querySelectorAll('.cart-info::before');
      if (cartInfoElements.length > 0) {
        console.log('[MenuView] 更新购物车图标颜色');
        // 购物车图标在使用了伪元素，可以通过更新CSS变量来控制其颜色
      }
      
      console.log('[MenuView] SVG颜色更新完成');
    }, 100); // 添加延迟确保主题变量已经应用
  } catch (e) {
    console.error('[MenuView] 更新SVG颜色时出错:', e);
  }
}

// 切换主题调试面板
function toggleThemeDebug() {
  showThemeDebugPanel.value = !showThemeDebugPanel.value;
  console.log(`[MenuView] 主题调试面板: ${showThemeDebugPanel.value ? '显示' : '隐藏'}`);
  
  // 显示当前主题所有CSS变量值
  if (showThemeDebugPanel.value) {
    const root = document.documentElement;
    const cssVars = {
      primary: getComputedStyle(root).getPropertyValue('--color-primary'),
      primaryDark: getComputedStyle(root).getPropertyValue('--color-primaryDark'),
      blueButton: getComputedStyle(root).getPropertyValue('--color-blueButton'),
      blueButtonDark: getComputedStyle(root).getPropertyValue('--color-blueButtonDark'),
      warning: getComputedStyle(root).getPropertyValue('--color-warning'),
      error: getComputedStyle(root).getPropertyValue('--color-error'),
      background: getComputedStyle(root).getPropertyValue('--color-background'),
      backgroundAlt: getComputedStyle(root).getPropertyValue('--color-backgroundAlt')
    };
    console.table(cssVars);
  }
}

// 组件挂载时
onMounted(() => {
  // 确保特效初始化
  initEffects();
  
  // 加载分类和商品数据
  productStore.loadCategories();
  productStore.loadProducts();
  
  // 同步自提/外送按钮状态与当前主题
  console.log('[MenuView] 初始主题:', themeStore.currentThemeId);
  
  // 初始化SVG颜色
  setTimeout(updateSvgColors, 500);
  
  // 打印诊断信息
  setTimeout(() => {
    console.log('[MenuView] Image loading status report:', getImageLoadReport());
    // 检查CSS变量是否正确应用
    const root = document.documentElement;
    console.log('[MenuView] CSS变量检查:', {
      primary: getComputedStyle(root).getPropertyValue('--color-primary'),
      blueButton: getComputedStyle(root).getPropertyValue('--color-blueButton'),
      background: getComputedStyle(root).getPropertyValue('--color-background')
    });
  }, 1000);
});

// 组件卸载前
onBeforeUnmount(() => {
  console.log('[MenuView] Image loading report before component unmount:', getImageLoadReport());
});

// 格式化价格，如果没有小数部分，不显示小数点后的0
function formatPrice(price) {
  if (Number.isInteger(price)) {
    return price.toString();
  } else {
    return price.toFixed(2).replace(/\.?0+$/, '');
  }
}

// 图片错误处理函数
function handleImageError(event, product) {
  console.error(`[MenuView] Image loading failed: ${event.target.src}`, {
    productId: product.id,
    productName: product.name,
    imagePath: product.thumbnailImage,
    element: event.target
  });
  
  // 尝试提供更多诊断信息
  const img = new Image();
  img.onload = () => console.log(`[MenuView] Test loading successful: ${product.thumbnailImage}`);
  img.onerror = () => console.error(`[MenuView] Test loading also failed: ${product.thumbnailImage}`);
  img.src = product.thumbnailImage;
}

// 格式化分类名称，为长单词中间添加零宽空格以便更好地换行
function formatCategoryName(name) {
  // 对于特殊的两个单词的情况，用空格分隔后单独处理
  if (name.includes(' ')) {
    const words = name.split(' ');
    // 如果是"Western Specialties"这种格式，直接换行展示
    if (words.length === 2 && words.every(word => word.length > 3)) {
      return words.join('\n');
    }
  }
  
  // 对于单词特别长的情况，在适当位置添加零宽空格以便浏览器更好地换行
  if (name.length > 10 && !name.includes(' ')) {
    // 在单词中间大约一半的位置添加零宽空格
    const middle = Math.floor(name.length / 2);
    return name.slice(0, middle) + '\u200B' + name.slice(middle);
  }
  
  return name;
}

// 根据文本长度返回对应的类名
function getTextLengthClass(text) {
  // 如果文本长度大于10或包含长单词，则标记为长文本
  if (text.length > 10 || (text.includes(' ') && text.split(' ').some(word => word.length > 6))) {
    return 'long';
  }
  return 'short';
}

// 显示支付成功浮层
function showPaymentSuccess() {
  // 这里可以添加显示支付成功浮层的逻辑
  console.log('Payment successful!');
}

// 关闭支付成功浮层
function closePaymentSuccess() {
  // 这里可以添加关闭支付成功浮层的逻辑
  console.log('Payment success modal closed');
}
</script>

<style scoped>
.menu-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background, #f5f5f5);
  position: relative;
  overflow: hidden;
}

/* Logo顶部栏样式 */
.logo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(10 * var(--vw-unit)) calc(16 * var(--vw-unit));
  background-color: var(--color-backgroundAlt, white); /* 使用与导航栏相同的背景颜色变量 */
  height: calc(62 * var(--vw-unit)); /* 放大约1.3倍（从48增加到62） */
  box-sizing: border-box;
  position: relative;
  z-index: 10; /* 确保在较高层级 */
  transition: background-color 0.3s; /* 平滑过渡背景色 */
  border-bottom: var(--border-width) solid var(--color-border, rgba(0, 0, 0, 0.05)); /* 添加与导航栏一致的底部边框 */
}

/* 适应不同主题 - 移除原有的伪元素背景 */
.logo-header::before {
  content: none; /* 移除原来的伪元素背景 */
}

.logo-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-image {
  height: calc(36 * var(--vw-unit)); /* 放大Logo图片（从28增加到36） */
  max-width: calc(156 * var(--vw-unit)); /* 放大Logo图片（从120增加到156） */
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)); /* 添加微妙阴影 */
  transition: filter 0.3s; /* 平滑过渡滤镜效果 */
}

/* 将功能按钮区复制到顶部栏 */
.header-buttons {
  margin-left: 0; /* 重置左侧外边距 */
  margin-right: 0; /* 重置右侧外边距 */
  background-color: rgba(255, 255, 255, 0.2); /* 保留原有的半透明背景 */
  border: var(--border-width) solid rgba(255, 255, 255, 0.2); /* 保留原有的半透明边框 */
  box-shadow: 0 var(--border-width) calc(2 * var(--vw-unit)) rgba(0, 0, 0, 0.05); /* 微妙阴影 */
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s; /* 平滑过渡效果 */
  height: calc(44 * var(--vw-unit)); /* 增加按钮高度 */
  min-width: calc(124 * var(--vw-unit)); /* 增加按钮区域宽度 */
}

/* 在深色模式下调整按钮区域 */
.alternate-theme .header-buttons {
  background-color: rgba(255, 255, 255, 0.15); /* 深色主题下稍微降低透明度 */
  border-color: rgba(255, 255, 255, 0.15); /* 深色主题下调整边框颜色 */
}

/* 根据主题调整按钮SVG图标颜色 - 修复重复代码 */
.default-theme .header-buttons .dots-icon {
  fill: var(--color-textPrimary, #333); /* 浅色主题下使用深色图标 */
}

.alternate-theme .header-buttons .dots-icon {
  fill: var(--color-textPrimary, #fff); /* 深色主题下使用浅色图标 */
}

.func-buttons {
  display: flex;
  align-items: center;
  margin-left: calc(5 * var(--vw-unit)); /* 减少左侧外边距 */
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: calc(22 * var(--vw-unit));
  padding: calc(3 * var(--vw-unit)) calc(6 * var(--vw-unit)); /* 减少内边距 */
  border: var(--border-width) solid var(--color-border, rgba(0, 0, 0, 0.05));
  box-shadow: 0 var(--border-width) calc(2 * var(--vw-unit)) 
              var(--color-backgroundDark, rgba(0, 0, 0, 0.03)); /* 响应主题的阴影 */
  width: auto;
  min-width: calc(95 * var(--vw-unit)); /* 减少最小宽度 */
  height: var(--button-height-sm); /* 明确设置高度 */
  box-sizing: border-box;
}

.button-divider {
  width: var(--border-width);
  height: calc(26 * var(--vw-unit)); /* 增加分隔线高度（从20增加到26） */
  background-color: var(--color-border, rgba(0, 0, 0, 0.1)); /* 使用主题变量，适应深色模式 */
  margin: 0 calc(4 * var(--vw-unit)); /* 略微增加分隔线两侧的间距 */
  flex-shrink: 0;
  transition: background-color 0.3s; /* 平滑过渡颜色变化 */
}

/* 深色主题下的分隔线颜色 */
.alternate-theme .button-divider {
  background-color: rgba(255, 255, 255, 0.2); /* 深色主题下使用浅色分隔线 */
}

.more-btn, .scan-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 calc(10 * var(--vw-unit)); /* 增加按钮内边距 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.2s;
  flex: 1;
  height: 100%;
}

.more-btn:hover, .scan-btn:hover {
  background-color: var(--color-backgroundDark, rgba(0, 0, 0, 0.05));
}

.scan-btn {
  padding: 0 calc(10 * var(--vw-unit));
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}

.search-container {
  width: 60%; /* 增加宽度比例 */
  position: relative;
  margin: 0 auto; /* 居中显示 */
  display: flex;
  align-items: center;
  background-color: var(--color-backgroundDark, rgb(246,246,246));
  border-radius: calc(22 * var(--vw-unit));
  padding: 0 calc(12 * var(--vw-unit));
  height: var(--button-height-sm);
  border: var(--border-width) solid var(--color-border, rgba(0, 0, 0, 0.05));
  box-shadow: 0 var(--border-width) calc(2 * var(--vw-unit)) 
              var(--color-backgroundDark, rgba(0, 0, 0, 0.03)); /* 响应主题的阴影 */
  box-sizing: border-box;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0;
  font-size: calc(13 * var(--vw-unit));
  height: 100%;
}

.search-icon {
  width: var(--icon-size-sm);
  height: var(--icon-size-sm);
  margin-right: calc(6 * var(--vw-unit));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 门店信息 */
.store-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(16 * var(--vw-unit)) calc(16 * var(--vw-unit)); /* 使用vw单位 */
  background-color: var(--color-backgroundAlt, white);
  border-bottom: none;
  height: calc(56 * var(--vw-unit));
  box-sizing: border-box;
}

.store-left {
  display: flex;
  align-items: center;
  font-size: calc(15 * var(--vw-unit)); /* 使用vw单位 */
  line-height: 1.4;
}

.location-icon {
  margin-right: calc(8 * var(--vw-unit)); /* 使用vw单位 */
  display: inline-block;
  vertical-align: middle;
  position: relative;
  top: calc(-1 * var(--vw-unit)); /* 使用vw单位 */
  width: calc(22 * var(--vw-unit)); /* 使用vw单位 */
  height: calc(22 * var(--vw-unit)); /* 使用vw单位 */
}

.store-name {
  font-weight: 500;
  letter-spacing: calc(0.2 * var(--vw-unit)); /* 使用vw单位 */
}

.arrow-icon::after {
  content: ">";
  margin-left: calc(6 * var(--vw-unit)); /* 使用vw单位 */
  font-size: calc(12 * var(--vw-unit)); /* 使用vw单位 */
  color: var(--color-textLight, #999);
  font-weight: 300; /* 减轻箭头粗细 */
}

.order-btn {
  display: flex;
  align-items: center;
  background-color: var(--color-backgroundDark, #f8f8f8);
  border: var(--border-width) solid var(--color-border, #e0e0e0);
  border-radius: calc(20 * var(--vw-unit)); /* 使用vw单位 */
  padding: calc(7 * var(--vw-unit)) calc(16 * var(--vw-unit)); /* 使用vw单位 */
  font-size: calc(14 * var(--vw-unit)); /* 使用vw单位 */
  font-weight: 500;
  color: var(--color-textPrimary, #333);
  box-shadow: 0 var(--border-width) calc(2 * var(--vw-unit)) 
              var(--color-backgroundDark, rgba(0, 0, 0, 0.05)); /* 响应主题的阴影 */
  transition: all 0.2s ease; /* 添加过渡效果 */
}

.order-btn:hover {
  background-color: var(--color-backgroundDark, #f0f0f0);
  border-color: var(--color-border, #d0d0d0);
}

.order-icon {
  margin-right: calc(6 * var(--vw-unit)); /* 使用vw单位 */
  color: var(--color-blueButtonDark, #003399); /* 使用深蓝色按钮变量 */
  position: relative;
  top: calc(-1 * var(--vw-unit)); /* 使用vw单位 */
  width: calc(18 * var(--vw-unit)); /* 使用vw单位 */
  height: calc(18 * var(--vw-unit)); /* 使用vw单位 */
}

/* 优惠信息 */
.promotion-info {
  display: flex;
  align-items: center;
  padding: calc(8 * var(--vw-unit)) calc(16 * var(--vw-unit)); /* 使用vw单位 */
  border-bottom: none; /* 移除分割线 */
  background-color: var(--color-backgroundAlt, white);
  height: calc(40 * var(--vw-unit));
  box-sizing: border-box;
}

.price-tag {
  font-size: calc(18 * var(--vw-unit)); /* 使用vw单位 */
  color: var(--color-priceColor, #ff5000);
  font-weight: bold;
  margin-right: calc(12 * var(--vw-unit)); /* 使用vw单位 */
}

.time-tag {
  padding: calc(2 * var(--vw-unit)) calc(8 * var(--vw-unit)); /* 使用vw单位 */
  background-color: var(--color-priceTagBackground, #fff0e8);
  color: var(--color-priceColor, #ff5000);
  border: var(--border-width) solid var(--color-priceBorder, #ffe0cc);
  border-radius: calc(12 * var(--vw-unit)); /* 使用vw单位 */
  font-size: calc(12 * var(--vw-unit)); /* 使用vw单位 */
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: row; /* 确保是水平布局 */
  overflow: hidden;
  background-color: var(--color-background, #f5f5f5);
  width: 100%;
  position: relative;
  gap: calc(2 * var(--vw-unit));
  /* 计算高度：视口高度减去增大后的logo顶部栏、导航栏和底部导航栏的高度 */
  height: calc(100vh - calc(62 * var(--vw-unit)) - calc(48 * var(--vw-unit)) - calc(56 * var(--vw-unit)));
  /* 为底部导航栏留出空间 */
}

/* 侧边分类菜单 */
.category-sidebar {
  width: 25%; /* 使用百分比宽度 */
  min-width: calc(60 * var(--vw-unit)); /* 设置最小宽度 */
  overflow-y: auto;
  background-color: var(--color-background, #f5f5f5);
  height: 100%; /* 填满主内容区 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0;
  
  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-list {
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: var(--color-background, #f5f5f5);
  border-radius: 0;
  box-shadow: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 确保内容垂直居中 */
  padding: calc(5 * var(--vw-unit)) 0;
  font-size: calc(12 * var(--vw-unit));
  line-height: 1.3;
  cursor: pointer;
  border-left: calc(4 * var(--vw-unit)) solid transparent;
  text-align: center;
  height: calc(48 * var(--vw-unit)); /* 固定高度 */
  box-sizing: border-box;
  width: 100%;
  transition: all 0.2s ease; /* 添加过渡效果 */
  position: relative; /* 确保相对定位 */
}

.category-item.active {
  color: var(--color-blueButton, rgb(0, 46, 184)); /* 使用蓝色按钮变量 */
  background: linear-gradient(to right, var(--color-backgroundDark, #e9e9e9) 0%, var(--color-background, #f5f5f5) 100%);
  border-left: none;
  position: relative;
  height: calc(56 * var(--vw-unit)); /* 减小选中时的高度 */
}

/* 创建选中标记 */
.category-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 12.5%;
  height: 75%;
  width: calc(6 * var(--vw-unit));
  background-color: var(--color-blueButton, rgb(0, 46, 184));
  border-radius: 0 50% 50% 0;
}

.category-logo {
  width: calc(26 * var(--vw-unit)); /* 增加图标大小 */
  height: calc(26 * var(--vw-unit));
  margin-bottom: calc(3 * var(--vw-unit));
  display: none; /* 始终隐藏logo */
  align-items: center;
  justify-content: center;
}

.category-item span {
  display: flex; /* flex布局 */
  flex-direction: column; /* 垂直方向布局，支持多行 */
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  width: 100%;
  height: 100%; /* 占满整个高度 */
  font-size: calc(12 * var(--vw-unit));
  color: var(--color-textTertiary, #666); /* 修改为使用主题变量，默认颜色更亮 */
  padding: 0 calc(4 * var(--vw-unit));
  box-sizing: border-box;
  text-align: center;
  white-space: pre-line; /* 保留\n换行符 */
  
  /* 防止过长的文本溢出 */
  overflow: hidden;
  line-height: 1.2; /* 调整行高以适应两行文本 */
}

/* 对于长文本特别处理 */
.category-item span[data-text-length="long"] {
  line-height: 1.1; /* 稍微紧凑一点 */
  font-size: calc(11 * var(--vw-unit)); /* 长文本稍微小一点 */
}

.category-item.active span {
  color: var(--color-blueButton, rgb(0, 46, 184));
  font-weight: 500;
  font-size: calc(15 * var(--vw-unit)); /* 放大选中时的文字 */
}

/* 对于长文本的选中状态 */
.category-item.active span[data-text-length="long"] {
  font-size: calc(13 * var(--vw-unit)); /* 长文本选中时稍微小一点 */
  line-height: 1.1;
}

/* 对于单词中间的软换行 */
.category-item span[data-text-length="long"]::after {
  content: "";
  display: block;
  height: 0;
  width: 0;
  margin-top: calc(-2 * var(--vw-unit));
}

/* 对于一些特定的分类项，强制单行显示 */
.category-item:nth-child(1) span,
.category-item:nth-child(3) span,
.category-item:nth-child(7) span,
.category-item:nth-child(9) span {
  white-space: nowrap; /* 短文本保持单行 */
  -webkit-line-clamp: 1; /* 只显示一行 */
}

/* 产品展示区 */
.product-display {
  width: 75%; /* 使用百分比宽度 */
  padding: calc(16 * var(--vw-unit)) calc(6 * var(--vw-unit)) 0 calc(2 * var(--vw-unit));
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--color-background, #f5f5f5);
  height: 100%; /* 填满主内容区 */
  box-sizing: border-box;
  
  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* 商品列表 */
.product-list {
  display: flex;
  flex-direction: column;
  background-color: var(--color-backgroundAlt, white);
  border-radius: calc(12 * var(--vw-unit)); /* 更柔和的圆角 */
  box-shadow: 0 calc(2 * var(--vw-unit)) calc(8 * var(--vw-unit)) 
              var(--color-backgroundDark, rgba(0, 0, 0, 0.08)); /* 响应主题的阴影 */
  padding: 0;
  margin: 0 calc(4 * var(--vw-unit)) calc(16 * var(--vw-unit)); /* 增加左右间距 */
  width: 98%; /* 确保不会导致横向滚动 */
  box-sizing: border-box;
  overflow: hidden; /* 确保内容不会溢出圆角边框 */
  border: var(--border-width) solid var(--color-border, rgba(0, 0, 0, 0.05)); /* 添加响应主题的边框 */
}

.product-item:first-of-type {
  border-top: none; /* 第一个商品项不需要上边框 */
}

.product-item {
  display: flex;
  position: relative;
  border-top: var(--border-width) solid var(--color-border, #f0f0f0); /* 使用主题变量，适应深色模式 */
  border-bottom: none; /* 移除底部边框 */
  padding: calc(14 * var(--vw-unit)) calc(12 * var(--vw-unit));
  margin-bottom: 0;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
}

.product-tag {
  position: absolute;
  top: calc(14 * var(--vw-unit));
  left: calc(12 * var(--vw-unit));
  background-color: var(--color-newTag, var(--color-blueButton, rgb(0, 33, 170)));
  color: white;
  font-size: calc(10 * var(--vw-unit));
  padding: calc(2 * var(--vw-unit)) calc(6 * var(--vw-unit));
  border-radius: calc(4 * var(--vw-unit));
  z-index: 50; /* 降低z-index值，确保小于结算栏的200 */
}

.product-img {
  width: calc(100 * var(--vw-unit));
  height: calc(100 * var(--vw-unit));
  border-radius: calc(8 * var(--vw-unit));
  background-color: var(--color-backgroundDark, #f0f0f0);
  background-size: cover;
  background-position: center;
  margin-right: calc(10 * var(--vw-unit));
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-textPrimary, #333);
  position: relative;
  overflow: hidden;
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: calc(15 * var(--vw-unit)); /* 固定字体大小 */
  margin: 0 0 calc(4 * var(--vw-unit));
  font-weight: bold;
}

.product-desc {
  font-size: calc(13 * var(--vw-unit)); /* 增大字体 */
  color: #888;
  margin: 0 0 auto;
}

.product-price-row {
  display: flex;
  align-items: center;
  margin-top: calc(8 * var(--vw-unit));
  justify-content: space-between;
}

.price-column {
  display: flex;
  flex-direction: column;
}

.price-info {
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap; /* 防止价格换行 */
}

.price-prefix {
  font-size: calc(14 * var(--vw-unit)); /* 固定字体大小 */
  color: var(--color-priceColor, #ff5000);
}

.price {
  font-size: calc(18 * var(--vw-unit)); /* 固定字体大小 */
  color: var(--color-priceColor, #ff5000);
  font-weight: bold;
}

.price-suffix {
  font-size: calc(13 * var(--vw-unit)); /* 增大字体 */
  color: var(--color-priceColor, #ff5000);
  margin-left: calc(4 * var(--vw-unit));
}

.original-price {
  font-size: calc(12 * var(--vw-unit)); /* 固定字体大小 */
  color: #999;
  margin-top: calc(2 * var(--vw-unit));
  text-decoration: line-through;
}

.cart-control {
  display: flex;
  align-items: center;
  position: relative;
}

.add-cart-btn {
  width: calc(28 * var(--vw-unit)); /* 按钮宽度 */
  height: calc(28 * var(--vw-unit)); /* 按钮高度 */
  border-radius: 50%; /* 圆形边框 */
  background-color: var(--color-blueButton, #003cc8); /* 使用蓝色按钮变量 */
  border: none; /* 无边框 */
  color: white; /* 文字颜色-白色 */
  position: relative; /* 相对定位 */
  cursor: pointer; /* 鼠标指针样式 */
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 0; /* 内边距为零 */
  box-shadow: 0 calc(2 * var(--vw-unit)) calc(4 * var(--vw-unit)) 
              var(--color-backgroundDark, rgba(0, 0, 0, 0.2)); /* 响应主题的阴影 */
}

.plus-icon {
  font-size: 0; /* 隐藏文本内容 */
  position: relative;
  width: calc(10 * var(--vw-unit));
  height: calc(10 * var(--vw-unit));
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
  width: calc(14 * var(--vw-unit));
  height: calc(2 * var(--vw-unit));
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.plus-icon::after {
  width: calc(2 * var(--vw-unit));
  height: calc(14 * var(--vw-unit));
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.section-title {
  font-size: calc(17 * var(--vw-unit));
  font-weight: bold;
  padding: calc(16 * var(--vw-unit)) calc(10 * var(--vw-unit)) calc(12 * var(--vw-unit));
  margin: 0;
  background-color: var(--color-backgroundAlt, white);
  border-top-left-radius: calc(12 * var(--vw-unit)); /* 更柔和的圆角 */
  border-top-right-radius: calc(12 * var(--vw-unit)); /* 更柔和的圆角 */
}

/* 底部结算栏 */
.checkout-bar {
  display: flex;
  justify-content: space-between; /* 改为两端对齐 */
  align-items: center;
  padding: 0 0 0 calc(16 * var(--vw-unit)); /* 只保留左侧内边距 */
  background-color: var(--color-background, white);
  border-radius: calc(30 * var(--vw-unit));
  box-shadow: 0 calc(2 * var(--vw-unit)) calc(8 * var(--vw-unit)) 
              var(--color-backgroundAlt, rgba(0, 0, 0, 0.1)); /* 根据主题调整阴影颜色 */
  width: 90%; /* 宽度设为90% */
  height: calc(70 * var(--vw-unit)); /* 从60调整为70，增加结算栏高度 */
  box-sizing: border-box;
  position: fixed;
  bottom: calc(80 * var(--vw-unit)); 
  left: 50%;
  transform: translateX(-50%);
  z-index: 200; /* 增加z-index确保其位于New标签之上 */
  overflow: hidden; /* 确保内容不溢出圆角 */
  border: var(--border-width) solid var(--color-border, rgba(0, 0, 0, 0.05)); /* 添加微妙边框增强可见度 */
}

.cart-info {
  display: flex;
  flex-direction: column;
  margin-left: calc(50 * var(--vw-unit)); /* 为购物袋图标留出空间 */
  position: relative;
  flex: 1; /* 占据剩余空间 */
  padding-right: calc(10 * var(--vw-unit)); /* 右侧留出一些空间 */
  justify-content: center; /* 垂直居中内容 */
}

.cart-info::before {
  content: "";
  position: absolute;
  left: calc(-40 * var(--vw-unit)); /* 调整图标位置 */
  top: 50%;
  transform: translateY(-50%);
  width: calc(38 * var(--vw-unit)); /* 增加图标尺寸 */
  height: calc(38 * var(--vw-unit)); /* 增加图标尺寸 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M7 18C8.1 18 9 18.9 9 20C9 21.1 8.1 22 7 22C5.9 22 5 21.1 5 20C5 18.9 5.9 18 7 18ZM17 18C18.1 18 19 18.9 19 20C19 21.1 18.1 22 17 22C15.9 22 15 21.1 15 20C15 18.9 15.9 18 17 18Z' fill='var(--color-blueButtonDark, %23003399)'/%3E%3Cpath d='M7 15H17C18.1 15 19 14.1 19 13V9C19 7.9 18.1 7 17 7H7C5.9 7 5 7.9 5 9V13C5 14.1 5.9 15 7 15Z' stroke='var(--color-blueButtonDark, %23003399)' stroke-width='2'/%3E%3Cpath d='M15 9H9C8.4 9 8 9.4 8 10C8 10.6 8.4 11 9 11H15C15.6 11 16 10.6 16 10C16 9.4 15.6 9 15 9Z' fill='var(--color-blueButtonDark, %23003399)'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%; /* 确保图标完全填充 */
}

.cart-info::after {
  content: attr(data-count);
  position: absolute;
  left: calc(-28 * var(--vw-unit)); /* 调整气泡位置 */
  top: calc(-6 * var(--vw-unit)); /* 微调顶部位置 */
  background-color: var(--color-itemCountBubble, #FF5000); /* 使用主题变量 */
  color: white;
  font-size: calc(12 * var(--vw-unit)); /* 增加字体大小 */
  font-weight: normal;
  width: calc(24 * var(--vw-unit)); /* 增加气泡尺寸 */
  height: calc(24 * var(--vw-unit)); /* 增加气泡尺寸 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--border-width) solid white;
}

.item-count-bubble {
  position: absolute;
  top: calc(-12 * var(--vw-unit));
  right: calc(-12 * var(--vw-unit));
  font-size: calc(11 * var(--vw-unit));
  font-weight: normal;
  color: white;
  background-color: var(--color-itemCountBubble, #FF5000); /* 使用主题变量 */
  border-radius: 50%;
  min-width: calc(22 * var(--vw-unit));
  height: calc(22 * var(--vw-unit));
  text-align: center;
  line-height: calc(22 * var(--vw-unit));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 2;
  box-shadow: none;
  border: var(--border-width) solid var(--color-backgroundAlt, white);
}

.total-price {
  font-size: calc(16 * var(--vw-unit)); /* 调整字体大小 */
  font-weight: 500; /* 调整字重 */
  line-height: 1.3; /* 增加行高 */
}

.total-price span {
  color: var(--color-priceColor, #ff5000);
  font-weight: bold;
  font-size: calc(18 * var(--vw-unit)); /* 增加价格字体大小 */
  margin-left: calc(6 * var(--vw-unit));
}

.discount-info {
  font-size: calc(11 * var(--vw-unit)); /* 缩小字体 */
  color: #999;
  margin-top: calc(2 * var(--vw-unit));
}

.checkout-btn {
  background-color: var(--color-blueButton, #003cc8); /* 使用蓝色按钮变量 */
  color: white;
  border: none;
  border-radius: 0 calc(30 * var(--vw-unit)) calc(30 * var(--vw-unit)) 0; /* 右侧圆角与结算栏一致 */
  padding: 0 calc(25 * var(--vw-unit));
  font-size: calc(18 * var(--vw-unit)); /* 从16增加到18 */
  font-weight: bold;
  height: 100%; /* 与结算栏同高 */
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: calc(100 * var(--vw-unit)); /* 最小宽度 */
  width: calc(90% / 3); /* 设置为结算栏宽度的1/3 */
}

.checkout-btn.disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.8;
}

/* 底部导航栏 */
.tab-bar {
  display: flex;
  justify-content: space-around;
  padding: calc(6 * var(--vw-unit)) 0;
  background-color: var(--color-backgroundAlt, white);
  border-top: var(--border-width) solid var(--color-border, #e0e0e0);
  width: 100%;
  height: calc(56 * var(--vw-unit));
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 50;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10 * var(--vw-unit));
  color: var(--color-textTertiary, rgb(195, 212, 220)); /* 未选中时的颜色 */
  padding: 0;
  transition: color 0.2s ease;
  flex: 1;
}

.tab-item.active {
  color: var(--color-blueButton, rgb(0, 46, 184)); /* 使用蓝色按钮变量 */
}

.tab-icon {
  width: calc(22 * var(--vw-unit));
  height: calc(22 * var(--vw-unit));
  margin-bottom: calc(3 * var(--vw-unit));
  position: relative;
}

/* 使用SVG图标，根据选中状态变色 */
.home-icon::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c3d4dc'%3E%3Cpath d='M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.tab-item.active .home-icon::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003cc8'%3E%3Cpath d='M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z'/%3E%3C/svg%3E");
}

.order-icon::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c3d4dc'%3E%3Cpath d='M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4zm-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.tab-item.active .order-icon::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003cc8'%3E%3Cpath d='M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4zm-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7z'/%3E%3C/svg%3E");
}

.mall-icon::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c3d4dc'%3E%3Cpath d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.tab-item.active .mall-icon::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003cc8'%3E%3Cpath d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E");
}

.card-icon::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c3d4dc'%3E%3Cpath d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.tab-item.active .card-icon::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003cc8'%3E%3Cpath d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'/%3E%3C/svg%3E");
}

.me-icon::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c3d4dc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.tab-item.active .me-icon::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003cc8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

/* 响应式调整 */
@media (max-height: 640px) {
  .logo-header {
    padding: calc(8 * var(--vw-unit)) calc(12 * var(--vw-unit));
    height: calc(52 * var(--vw-unit)); /* 在小屏幕上稍微减小高度 */
  }
  
  .logo-image {
    height: calc(30 * var(--vw-unit)); /* 在小屏幕上稍微减小尺寸 */
  }
  
  .header-buttons {
    height: calc(38 * var(--vw-unit)); /* 在小屏幕上稍微减小高度 */
    min-width: calc(110 * var(--vw-unit));
  }
  
  .more-btn svg, .scan-btn svg {
    transform: scale(0.9); /* 在小屏幕上稍微缩小图标 */
  }

  .category-item {
    padding: calc(3 * var(--vw-unit)) 0;
    font-size: calc(11 * var(--vw-unit));
    height: calc(42 * var(--vw-unit)); /* 较小屏幕上减小高度 */
  }
  
  .category-item.active {
    height: calc(48 * var(--vw-unit)); /* 较小屏幕上减小选中项高度 */
  }
  
  .category-item.active span {
    font-size: calc(14 * var(--vw-unit)); /* 较小屏幕上稍微减小选中项字体 */
  }
  
  .product-img {
    width: calc(80 * var(--vw-unit));
    height: calc(80 * var(--vw-unit));
  }
  
  .checkout-bar {
    bottom: calc(66 * var(--vw-unit)); /* 调整结算栏位置 */
  }
  
  /* 导航栏响应式调整 */
  .nav-bar {
    padding: calc(6 * var(--vw-unit)) calc(12 * var(--vw-unit));
    gap: calc(8 * var(--vw-unit)); /* 缩小元素间距 */
  }
  
  .delivery-toggle {
    width: calc(130 * var(--vw-unit)); /* 调整宽度 */
    margin-right: calc(4 * var(--vw-unit));
  }
  
  .toggle-btn {
    padding: 0 calc(10 * var(--vw-unit));
    font-size: calc(12 * var(--vw-unit));
    min-width: calc(55 * var(--vw-unit)); /* 调整最小宽度 */
  }
  
  .search-container {
    width: 38%; /* 减小宽度占比 */
    margin: 0 calc(4 * var(--vw-unit)); /* 减小外边距 */
  }
}

@media (min-height: 800px) {
  .logo-header {
    padding: calc(12 * var(--vw-unit)) calc(16 * var(--vw-unit));
    height: calc(68 * var(--vw-unit)); /* 在大屏幕上进一步增大高度 */
  }
  
  .logo-image {
    height: calc(40 * var(--vw-unit)); /* 在大屏幕上进一步增大尺寸 */
  }
  
  .header-buttons {
    height: calc(48 * var(--vw-unit)); /* 在大屏幕上进一步增大按钮高度 */
    min-width: calc(130 * var(--vw-unit));
  }
  
  .more-btn svg, .scan-btn svg {
    transform: scale(1.1); /* 在大屏幕上进一步放大图标 */
  }

  .category-item {
    height: calc(54 * var(--vw-unit)); /* 大屏幕上增加高度 */
    font-size: calc(13 * var(--vw-unit));
  }
  
  .category-item.active {
    height: calc(60 * var(--vw-unit)); /* 大屏幕上增加选中项高度 */
  }
  
  .category-item.active span {
    font-size: calc(16 * var(--vw-unit)); /* 大屏幕上增加选中项字体 */
  }
  
  .checkout-bar {
    /* 调整结算栏位置 */
    bottom: calc(40 * var(--vw-unit)); 
  }
  
  /* 导航栏响应式调整 */
  .nav-bar {
    gap: calc(16 * var(--vw-unit)); /* 增加元素间距 */
  }
  
  .delivery-toggle {
    width: calc(150 * var(--vw-unit)); /* 增加宽度 */
    margin-right: calc(12 * var(--vw-unit));
  }
  
  .toggle-btn {
    min-width: calc(65 * var(--vw-unit)); /* 增加最小宽度 */
    padding: 0 calc(16 * var(--vw-unit)); /* 增加内边距 */
  }
  
  .search-container {
    margin: 0 calc(12 * var(--vw-unit)); /* 增加外边距 */
  }
}

/* 特定宽度调整 */
@media (max-width: 400px) {
  .logo-header {
    padding: calc(6 * var(--vw-unit)) calc(10 * var(--vw-unit)); /* 减少内边距 */
  }

  .toggle-btn:last-child {
    font-size: calc(11.5 * var(--vw-unit)); /* 更小的字体 */
    letter-spacing: calc(-0.1 * var(--vw-unit)); /* 轻微的负字母间距 */
  }
  
  .nav-bar {
    padding: calc(6 * var(--vw-unit)) calc(8 * var(--vw-unit)); /* 进一步减少内边距 */
    gap: calc(4 * var(--vw-unit)); /* 进一步缩小元素间距 */
  }
  
  .delivery-toggle {
    width: calc(115 * var(--vw-unit)); /* 进一步调整宽度 */
    margin-right: calc(2 * var(--vw-unit)); /* 进一步减少外边距 */
  }
  
  .toggle-btn {
    min-width: calc(48 * var(--vw-unit)); /* 减少最小宽度 */
    padding: 0 calc(6 * var(--vw-unit)); /* 减少内边距 */
    font-size: calc(11.5 * var(--vw-unit)); /* 调整字体大小 */
  }
  
  .search-container {
    width: 32%; /* 更小的宽度 */
    margin: 0 calc(3 * var(--vw-unit)); /* 进一步减少外边距 */
  }
  
  .func-buttons {
    min-width: calc(85 * var(--vw-unit)); /* 减少最小宽度 */
    padding: calc(3 * var(--vw-unit)) calc(4 * var(--vw-unit)); /* 减少内边距 */
    margin-left: calc(2 * var(--vw-unit)); /* 减少左侧外边距 */
  }
  
  .more-btn, .scan-btn {
    padding: 0 calc(6 * var(--vw-unit)); /* 减少按钮内边距 */
  }
}

/* 数字标牌系统方框 */
.digital-signage-panel {
  position: fixed;
  top: calc(50 * var(--vw-unit));
  right: calc(16 * var(--vw-unit));
  background-color: var(--color-backgroundAlt, white);
  border-radius: calc(8 * var(--vw-unit));
  width: calc(180 * var(--vw-unit));
  box-shadow: 0 calc(2 * var(--vw-unit)) calc(10 * var(--vw-unit)) 
              var(--color-backgroundDark, rgba(0, 0, 0, 0.15)); /* 响应主题的阴影 */
  z-index: 1000;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(calc(-10 * var(--vw-unit)));
  pointer-events: none;
  border: var(--border-width) solid var(--color-border, rgba(0, 0, 0, 0.05)); /* 添加响应主题的边框 */
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(12 * var(--vw-unit)) calc(16 * var(--vw-unit));
  border-bottom: var(--border-width) solid var(--color-border, #f0f0f0); /* 使用主题变量，适应深色模式 */
}

.panel-header span {
  font-size: calc(15 * var(--vw-unit));
  font-weight: 500;
  color: var(--color-textPrimary, #333);
}

.close-btn {
  background: none;
  border: none;
  font-size: calc(18 * var(--vw-unit));
  color: var(--color-textLight, #999);
  cursor: pointer;
  padding: 0;
  width: calc(24 * var(--vw-unit));
  height: calc(24 * var(--vw-unit));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.panel-content {
  padding: calc(8 * var(--vw-unit));
}

.panel-item {
  display: flex;
  align-items: center;
  padding: calc(12 * var(--vw-unit));
  border-radius: calc(8 * var(--vw-unit));
  cursor: pointer;
  transition: background-color 0.2s;
}

.panel-item svg {
  margin-right: calc(12 * var(--vw-unit));
  width: calc(20 * var(--vw-unit));
  height: calc(20 * var(--vw-unit));
}

.panel-item span {
  font-size: calc(14 * var(--vw-unit));
  color: var(--color-textPrimary, #333);
}

.item-count-bubble {
  position: absolute;
  top: calc(-12 * var(--vw-unit));
  right: calc(-12 * var(--vw-unit));
  font-size: calc(11 * var(--vw-unit));
  font-weight: normal;
  color: white;
  background-color: var(--color-itemCountBubble, #FF5000); /* 使用主题变量 */
  border-radius: 50%;
  min-width: calc(22 * var(--vw-unit));
  height: calc(22 * var(--vw-unit));
  text-align: center;
  line-height: calc(22 * var(--vw-unit));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 2;
  box-shadow: none;
  border: var(--border-width) solid var(--color-backgroundAlt, white);
}

/* 确保左按钮略大一些 */
.delivery-toggle .toggle-btn:first-child {
  flex: 1.1; /* 给第一个按钮略多的空间 */
}

.delivery-toggle .toggle-btn:last-child {
  flex: 0.9; /* 给第二个按钮略少的空间 */
}

/* 添加SVG样式，用于主题切换 */
.svg-blue-fill { fill: var(--color-blueButton, #003cc8) !important; }
.svg-blue-stroke { stroke: var(--color-blueButton, #003cc8) !important; }
.svg-blue-dark-fill { fill: var(--color-blueButtonDark, #003399) !important; }
.svg-blue-dark-stroke { stroke: var(--color-blueButtonDark, #003399) !important; }

/* 为SVG图标添加通用样式 */
svg path.theme-fill { fill: var(--color-blueButtonDark, #003399) !important; }
svg path.theme-stroke { stroke: var(--color-blueButtonDark, #003399) !important; }

/* 为订单图标SVG添加特定样式 */
.order-btn svg path[fill="#0039ac"],
.store-info svg path[fill="#0039ac"] {
  fill: var(--color-blueButtonDark, #0039ac);
}

.order-btn svg path[stroke="#0039ac"],
.store-info svg path[stroke="#0039ac"] {
  stroke: var(--color-blueButtonDark, #0039ac);
}

/* 添加SVG动态更新的类，使用JavaScript来实现动态颜色 */
.svg-dynamic-color {
  filter: var(--svg-color-filter);
}

/* 为购物车图标定义样式 */
.cart-icon-theme {
  fill: var(--color-blueButtonDark, #003399) !important;
  stroke: var(--color-blueButtonDark, #003399) !important;
}


.modal-content {
  background-color: var(--color-backgroundAlt, white);
  border-radius: calc(12 * var(--vw-unit));
  width: 80%;
  max-width: calc(320 * var(--vw-unit));
  padding: calc(24 * var(--vw-unit));
  text-align: center;
  box-shadow: 0 calc(4 * var(--vw-unit)) calc(20 * var(--vw-unit)) rgba(0, 0, 0, 0.2);
}

.panel-item:hover {
  background-color: var(--color-backgroundDark, rgba(0, 0, 0, 0.05));
}

.close-btn:hover {
  background-color: var(--color-backgroundDark, rgba(0, 0, 0, 0.05));
}

/* Logo顶部栏样式 */
.logo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(10 * var(--vw-unit)) calc(16 * var(--vw-unit));
  background-color: var(--color-backgroundAlt, white); /* 使用与导航栏相同的背景颜色变量 */
  height: calc(62 * var(--vw-unit)); /* 放大约1.3倍（从48增加到62） */
  box-sizing: border-box;
  position: relative;
  z-index: 10; /* 确保在较高层级 */
  transition: background-color 0.3s; /* 平滑过渡背景色 */
  border-bottom: var(--border-width) solid var(--color-border, rgba(0, 0, 0, 0.05)); /* 添加与导航栏一致的底部边框 */
}

/* 适应不同主题 - 移除原有的伪元素背景 */
.logo-header::before {
  content: none; /* 移除原来的伪元素背景 */
}

.logo-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-image {
  height: calc(36 * var(--vw-unit)); /* 放大Logo图片（从28增加到36） */
  max-width: calc(156 * var(--vw-unit)); /* 放大Logo图片（从120增加到156） */
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)); /* 添加微妙阴影 */
  transition: filter 0.3s; /* 平滑过渡滤镜效果 */
}

/* 将功能按钮区复制到顶部栏 */
.header-buttons {
  margin-left: 0; /* 重置左侧外边距 */
  margin-right: 0; /* 重置右侧外边距 */
  background-color: rgba(255, 255, 255, 0.2); /* 保留原有的半透明背景 */
  border: var(--border-width) solid rgba(255, 255, 255, 0.2); /* 保留原有的半透明边框 */
  box-shadow: 0 var(--border-width) calc(2 * var(--vw-unit)) rgba(0, 0, 0, 0.05); /* 微妙阴影 */
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s; /* 平滑过渡效果 */
  height: calc(44 * var(--vw-unit)); /* 增加按钮高度 */
  min-width: calc(124 * var(--vw-unit)); /* 增加按钮区域宽度 */
}

/* 在深色模式下调整按钮区域 */
.alternate-theme .header-buttons {
  background-color: rgba(255, 255, 255, 0.15); /* 深色主题下稍微降低透明度 */
  border-color: rgba(255, 255, 255, 0.15); /* 深色主题下调整边框颜色 */
}

/* 根据主题调整按钮SVG图标颜色 */
.default-theme .header-buttons .dots-icon {
  fill: var(--color-textPrimary, #333); /* 浅色主题下使用深色图标 */
}

.alternate-theme .header-buttons .dots-icon {
  fill: var(--color-textPrimary, #fff); /* 深色主题下使用浅色图标 */
}

.button-divider {
  width: var(--border-width);
  height: calc(26 * var(--vw-unit)); /* 增加分隔线高度（从20增加到26） */
  background-color: var(--color-border, rgba(0, 0, 0, 0.1)); /* 使用主题变量，适应深色模式 */
  margin: 0 calc(4 * var(--vw-unit)); /* 略微增加分隔线两侧的间距 */
  flex-shrink: 0;
  transition: background-color 0.3s; /* 平滑过渡颜色变化 */
}

/* 深色主题下的分隔线颜色 */
.alternate-theme .button-divider {
  background-color: rgba(255, 255, 255, 0.2); /* 深色主题下使用浅色分隔线 */
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(8 * var(--vw-unit)) calc(12 * var(--vw-unit)); /* 减少水平内边距 */
  background-color: var(--color-backgroundAlt, white);
  border-bottom: none;
  height: calc(48 * var(--vw-unit));
  box-sizing: border-box;
  gap: calc(8 * var(--vw-unit)); /* 减少元素之间的间距 */
}

.delivery-toggle {
  display: flex;
  border: var(--border-width) solid rgba(0, 0, 0, 0.05);
  border-radius: calc(22 * var(--vw-unit));
  overflow: hidden;
  flex-shrink: 0;
  height: var(--button-height-sm);
  box-sizing: border-box;
  width: calc(130 * var(--vw-unit)); /* 减少宽度 */
  margin-right: calc(5 * var(--vw-unit)); /* 减少右侧外边距 */
}

.toggle-btn {
  padding: 0 calc(14 * var(--vw-unit)); /* 增加内边距 */
  border: none;
  background-color: rgba(255, 255, 255, 0.7);
  font-size: calc(13 * var(--vw-unit));
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  min-width: calc(60 * var(--vw-unit)); /* 增加最小宽度 */
  font-weight: 400; /* 统一字重 */
  flex: 1; /* 平均分配空间 */
  white-space: nowrap; /* 确保文本不换行 */
}

/* 专门针对"Pick Up"按钮的样式 */
.toggle-btn:first-child {
  min-width: calc(68 * var(--vw-unit)); /* 为Pick Up按钮增加更多宽度 */
  padding: 0 calc(10 * var(--vw-unit)); /* 调整内边距 */
  letter-spacing: 0; /* 确保字母间距正常 */
}

.toggle-btn.active {
  background-color: var(--color-primary, rgb(0, 46, 184));
  color: white;
  font-weight: 500;
  letter-spacing: calc(0.2 * var(--vw-unit)); /* 增加字母间距提高可读性 */
}

/* 为了确保文字完整显示，对特定文字内容的按钮进行调整 */
.toggle-btn:last-child {
  letter-spacing: 0; /* 对"Delivery"按钮减少字母间距 */
  font-size: calc(12.5 * var(--vw-unit)); /* 稍微调整字体大小 */
}

/* 在小屏幕下进一步优化 */
@media (max-width: 400px) {
  .toggle-btn:last-child {
    font-size: calc(11.5 * var(--vw-unit)); /* 更小的字体 */
    letter-spacing: calc(-0.1 * var(--vw-unit)); /* 轻微的负字母间距 */
  }
}

.func-buttons {
  display: flex;
  align-items: center;
  margin-left: calc(5 * var(--vw-unit)); /* 减少左侧外边距 */
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: calc(22 * var(--vw-unit));
  padding: calc(3 * var(--vw-unit)) calc(6 * var(--vw-unit)); /* 减少内边距 */
  border: var(--border-width) solid var(--color-border, rgba(0, 0, 0, 0.05));
  box-shadow: 0 var(--border-width) calc(2 * var(--vw-unit)) 
              var(--color-backgroundDark, rgba(0, 0, 0, 0.03)); /* 响应主题的阴影 */
  width: auto;
  min-width: calc(95 * var(--vw-unit)); /* 减少最小宽度 */
  height: var(--button-height-sm); /* 明确设置高度 */
  box-sizing: border-box;
}

/* 确保左按钮略大一些 */
.delivery-toggle .toggle-btn:first-child {
  flex: 1.1; /* 给第一个按钮略多的空间 */
}

.delivery-toggle .toggle-btn:last-child {
  flex: 0.9; /* 给第二个按钮略少的空间 */
}

/* 根据主题调整按钮SVG图标颜色 */
.default-theme .header-buttons .dots-icon {
  fill: var(--color-textPrimary, #333); /* 浅色主题下使用深色图标 */
}

.alternate-theme .header-buttons .dots-icon {
  fill: var(--color-textPrimary, #fff); /* 深色主题下使用浅色图标 */
}

/* 扫描按钮的特定样式 */
.default-theme .header-buttons .scan-icon-bg {
  fill: #222; /* 浅色主题下背景圆为黑色 */
}

.alternate-theme .header-buttons .scan-icon-bg {
  fill: #222; /* 深色主题下背景圆保持黑色 */
}

.default-theme .header-buttons .scan-icon-circle {
  stroke: white; /* 浅色主题下内圆为白色描边 */
}

.alternate-theme .header-buttons .scan-icon-circle {
  stroke: white; /* 深色主题下内圆保持白色描边 */
}

/* 确保SVG图标颜色平滑过渡 */
.header-buttons svg circle {
  transition: fill 0.3s, stroke 0.3s;
}

/* 按钮悬停效果 */
.header-buttons .more-btn:hover,
.header-buttons .scan-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 按钮点击效果 */
.header-buttons .more-btn:active,
.header-buttons .scan-btn:active {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
}

/* 深色主题下按钮悬停效果 */
.alternate-theme .header-buttons .more-btn:hover,
.alternate-theme .header-buttons .scan-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 深色主题下按钮点击效果 */
.alternate-theme .header-buttons .more-btn:active,
.alternate-theme .header-buttons .scan-btn:active {
  background-color: rgba(255, 255, 255, 0.15);
}
</style> 