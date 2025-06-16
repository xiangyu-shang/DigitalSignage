/**
 * 菜单页面实现测试
 */

import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';

// 导入组件
import MenuView from '../../src/renderer/views/MenuView.vue';
import AppHeader from '../../src/renderer/components/common/AppHeader.vue';
import CategoryList from '../../src/renderer/components/menu/CategoryList.vue';
import SearchBar from '../../src/renderer/components/menu/SearchBar.vue';
import ProductGrid from '../../src/renderer/components/menu/ProductGrid.vue';
import ProductCard from '../../src/renderer/components/common/ProductCard.vue';
import CartButton from '../../src/renderer/components/common/CartButton.vue';

// 导入存储
import { useProductStore } from '../../src/renderer/stores/product';
import { useCartStore } from '../../src/renderer/stores/cart';
import { useSettingsStore } from '../../src/renderer/stores/settings';

// 模拟音效管理器
jest.mock('../../src/renderer/utils/effects', () => ({
  soundManager: {
    play: jest.fn(),
  },
  rippleEffect: {
    init: jest.fn(),
  },
  initEffects: jest.fn(),
}));

// 模拟API调用
jest.mock('../../src/renderer/utils/api', () => ({
  fetchProducts: jest.fn(() => Promise.resolve([
    {
      id: 'p1',
      name: 'TestProduct',
      price: 1000,
      originalPrice: 2000,
      discount: 0.5,
      description: '测试商品',
      images: ['/images/test.jpg'],
      thumbnailImage: '/images/test_thumb.jpg',
      rating: 4.5,
      reviewCount: 100,
    }
  ])),
  fetchCategories: jest.fn(() => Promise.resolve([
    { id: 'c1', name: '分类1', icon: 'phone-portrait' },
    { id: 'c2', name: '分类2', icon: 'laptop' },
  ])),
  fetchProductById: jest.fn(() => Promise.resolve({
    id: 'p1',
    name: 'TestProduct',
    price: 1000,
  })),
}));

describe('菜单页面实现测试', () => {
  let router;
  let wrapper;
  let pinia;
  
  beforeEach(() => {
    // 创建新的Pinia实例
    pinia = createPinia();
    setActivePinia(pinia);
    
    // 创建路由
    router = createRouter({
      history: createWebHashHistory(),
      routes: [
        { path: '/', name: 'Menu', component: MenuView },
        { path: '/detail/:id', name: 'Detail', component: { template: '<div>Detail</div>' } },
        { path: '/end', name: 'End', component: { template: '<div>End</div>' } }
      ]
    });
    
    // 全局挂载配置
    const globalMountOptions = {
      global: {
        plugins: [router, pinia],
        stubs: {
          AppHeader: true,
          CategoryList: true,
          SearchBar: true,
          ProductGrid: true,
        }
      }
    };
    
    // 挂载菜单视图组件
    wrapper = mount(MenuView, globalMountOptions);
  });
  
  afterEach(() => {
    // 清理
    wrapper.unmount();
    jest.clearAllMocks();
  });
  
  test('菜单页面应包含所有主要组件', () => {
    // 检查各个主要组件是否存在
    expect(wrapper.findComponent({ name: 'AppHeader' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'CategoryList' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SearchBar' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ProductGrid' }).exists()).toBe(true);
  });
  
  test('页面布局结构应正确', () => {
    // 检查布局结构
    expect(wrapper.find('.menu-view').exists()).toBe(true);
    expect(wrapper.find('.menu-content').exists()).toBe(true);
    expect(wrapper.find('.sidebar').exists()).toBe(true);
    expect(wrapper.find('.main-content').exists()).toBe(true);
  });
  
  test('分类列表组件应能正确展示分类', async () => {
    // 创建一个隔离的分类列表组件测试
    const categoryWrapper = mount(CategoryList, {
      global: {
        plugins: [pinia],
      }
    });
    
    // 获取分类存储
    const productStore = useProductStore();
    
    // 等待异步数据加载完成
    await flushPromises();
    
    // 检查分类项是否渲染
    expect(categoryWrapper.findAll('.category-item').length).toBeGreaterThan(0);
    
    // 检查分类点击事件
    await categoryWrapper.find('.category-item').trigger('click');
    
    // 验证分类过滤器是否被设置
    expect(productStore.filters.categoryId).toBeDefined();
    
    // 清理
    categoryWrapper.unmount();
  });
  
  test('搜索栏组件应能过滤商品', async () => {
    // 创建一个隔离的搜索栏组件测试
    const searchWrapper = mount(SearchBar, {
      global: {
        plugins: [pinia],
      }
    });
    
    // 获取商品存储
    const productStore = useProductStore();
    
    // 设置搜索关键词
    const searchInput = searchWrapper.find('.search-input');
    await searchInput.setValue('test');
    
    // 触发搜索
    await searchWrapper.find('.search-button').trigger('click');
    
    // 验证搜索查询是否被设置
    expect(productStore.searchQuery).toBe('test');
    
    // 测试排序功能
    const sortButtons = searchWrapper.findAll('.filter-option');
    if (sortButtons.length > 0) {
      await sortButtons[1].trigger('click'); // 点击第二个排序选项
      expect(productStore.filters.sortBy).toBeDefined();
    }
    
    // 清理
    searchWrapper.unmount();
  });
  
  test('商品卡片应正确展示商品信息并支持添加到购物车', async () => {
    // 准备测试数据
    const mockProduct = {
      id: 'p1',
      name: 'TestProduct',
      price: 1000,
      originalPrice: 2000,
      discount: 0.5,
      description: '测试商品',
      images: ['/images/test.jpg'],
      thumbnailImage: '/images/test_thumb.jpg',
      rating: 4.5,
      reviewCount: 100,
    };
    
    // 创建一个隔离的商品卡片组件测试
    const cardWrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
      }
    });
    
    // 获取购物车存储
    const cartStore = useCartStore();
    
    // 检查商品信息是否正确显示
    expect(cardWrapper.find('.product-name').text()).toBe(mockProduct.name);
    expect(cardWrapper.find('.product-discount').exists()).toBe(true);
    expect(cardWrapper.find('.current-price').exists()).toBe(true);
    
    // 添加到购物车
    await cardWrapper.find('.add-to-cart-button').trigger('click');
    
    // 验证商品已添加到购物车
    expect(cartStore.items.length).toBe(1);
    expect(cartStore.items[0].product.id).toBe(mockProduct.id);
    
    // 清理
    cardWrapper.unmount();
  });
  
  test('购物车按钮应显示正确的商品数量和总价', async () => {
    // 获取购物车存储
    const cartStore = useCartStore();
    
    // 添加测试商品到购物车
    cartStore.addItem({
      id: 'p1',
      name: 'TestProduct',
      price: 1000,
    });
    
    // 创建一个隔离的购物车按钮组件测试
    const cartButtonWrapper = mount(CartButton, {
      global: {
        plugins: [pinia, router],
      }
    });
    
    // 检查购物车数量
    const cartCount = cartButtonWrapper.find('.cart-count');
    expect(cartCount.exists()).toBe(true);
    expect(cartCount.text()).toBe('1');
    
    // 检查总价
    const cartPrice = cartButtonWrapper.find('.cart-price');
    expect(cartPrice.exists()).toBe(true);
    
    // 点击购物车按钮
    await cartButtonWrapper.trigger('click');
    
    // 验证导航到结算页面
    expect(router.currentRoute.value.name).toBe('End');
    
    // 清理
    cartButtonWrapper.unmount();
  });
}); 