import mockProducts from '../../mock/products';
import mockCategories from '../../mock/categories';

/**
 * 模拟API延迟
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取商品列表
 * @param {Object} options - 查询选项
 * @param {string} options.categoryId - 分类ID
 * @param {string} options.search - 搜索关键词
 * @param {number} options.minPrice - 最低价格
 * @param {number} options.maxPrice - 最高价格
 * @param {string} options.sortBy - 排序方式
 * @returns {Promise<Array>} 商品列表
 */
export async function fetchProducts(options = {}) {
  // 模拟API延迟
  await delay(300);
  
  try {
    // 过滤数据
    let filtered = [...mockProducts];
    
    if (options.categoryId) {
      filtered = filtered.filter(product => product.categoryId === options.categoryId);
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (options.minPrice !== null && options.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= options.minPrice);
    }
    
    if (options.maxPrice !== null && options.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= options.maxPrice);
    }
    
    // 排序
    switch (options.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        // 默认保持原有顺序
        break;
    }
    
    return filtered;
  } catch (error) {
    console.error('Failed to fetch product list', error);
    return [];
  }
}

/**
 * 获取商品详情
 * @param {string} id - 商品ID
 * @returns {Promise<Object|null>} 商品详情
 */
export async function fetchProductById(id) {
  // 模拟API延迟
  await delay(200);
  
  try {
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      throw new Error(`Product does not exist: ${id}`);
    }
    
    // 返回商品详情（可能包含更多信息）
    return {
      ...product,
      relatedProducts: getRelatedProducts(product, 4),
    };
  } catch (error) {
    console.error(`Failed to get product details: ID ${id}`, error);
    return null;
  }
}

/**
 * 获取分类列表
 * @returns {Promise<Array>} 分类列表
 */
export async function fetchCategories() {
  // 模拟API延迟
  await delay(150);
  
  try {
    return mockCategories;
  } catch (error) {
    console.error('Failed to fetch category list', error);
    return [];
  }
}

/**
 * 获取相关商品
 * @param {Object} product - 当前商品
 * @param {number} limit - 返回数量
 * @returns {Array} 相关商品列表
 */
function getRelatedProducts(product, limit = 4) {
  // 查找同类别的商品
  const sameCategoryProducts = mockProducts.filter(p => 
    p.id !== product.id && p.categoryId === product.categoryId
  );
  
  // 如果同类别商品不足，则添加其他商品
  let related = [...sameCategoryProducts];
  if (related.length < limit) {
    const otherProducts = mockProducts.filter(p =>
      p.id !== product.id && p.categoryId !== product.categoryId
    );
    
    related = [...related, ...otherProducts];
  }
  
  // 截取指定数量并返回
  return related.slice(0, limit);
} 