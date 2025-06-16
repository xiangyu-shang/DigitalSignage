/**
 * 商品描述更新辅助脚本
 * 此脚本用于根据UI目录图片内容更新商品描述
 * 
 * 使用方法:
 * 1. 先查看UI图片内容并整理相关商品信息
 * 2. 在下面的productUpdates对象中填写对应的更新内容
 * 3. 运行脚本：node update-products-description.js
 */

const fs = require('fs');
const path = require('path');

// 产品数据文件路径
const PRODUCTS_FILE_PATH = path.join(__dirname, 'src', 'mock', 'products.js');
const BACKUP_PATH = path.join(__dirname, 'copy', 'products_updated.js');
const LOG_PATH = path.join(__dirname, 'update-product-log.txt');

// 根据UI目录图片内容的商品描述更新（咖啡和甜品主题）
const productUpdates = {
  // 这里填写从UI图片中提取的商品信息
  // 对应Detail.jpg的商品(咖啡)
  'p1': {
    name: '意式浓缩咖啡',
    description: '采用精选阿拉比卡咖啡豆，经过意式烘焙工艺，口感浓郁醇厚，香气馥郁持久。每一杯都经过严格的萃取标准，确保最佳风味。搭配我们的特制甜点，带来完美下午茶体验。',
    specs: {
      processor: '进口阿拉比卡豆',
      memory: '意式深度烘焙',
      storage: '24小时内新鲜现磨',
      screen: '精准9bar压力萃取',
      camera: '独特风味调配',
      battery: '馥郁持久香气',
    },
    options: {
      colors: [
        { name: '标准型', code: '#3a2218', image: '/images/coffee_standard.jpg' },
        { name: '双倍浓缩', code: '#251607', image: '/images/coffee_double.jpg' },
      ],
    },
    inStock: true,
    popularity: 95,
    rating: 4.8,
  },
  
  // 对应Detail02.jpg的商品(拿铁)
  'p2': {
    name: '香草拿铁咖啡',
    description: '香浓的意式浓缩与新鲜牛奶的完美结合，加入优质香草糖浆，带来甜而不腻的口感。顶层奶泡细腻丝滑，创造出层次丰富的味觉体验。适合任何时候享用的经典选择。',
    specs: {
      processor: '特选咖啡豆',
      memory: '专业意式萃取',
      storage: '新鲜牛奶调制',
      screen: '精致奶泡艺术',
      graphics: '天然香草风味',
      battery: '层次丰富口感',
    },
    options: {
      colors: [
        { name: '热饮', code: '#c8a47e', image: '/images/latte_hot.jpg' },
        { name: '冰饮', code: '#e8d4ba', image: '/images/latte_iced.jpg' },
      ],
      memory: ['标准', '低糖', '无糖'],
    },
    inStock: true,
    popularity: 92,
    rating: 4.7,
  },
  
  // 对应Detail03.jpg的商品(蛋糕)
  'p3': {
    name: '法式草莓蛋糕',
    description: '采用法国进口发酵黄油与新鲜草莓制作，搭配轻盈的香草海绵蛋糕和独特草莓慕斯，每一口都充满丰富层次感。顶部装饰季节新鲜水果，既是味蕾的享受也是视觉的盛宴。',
    specs: {
      processor: '法国AOP认证发酵黄油',
      memory: '当季新鲜草莓',
      storage: '手工制作',
      screen: '多层次口感设计',
      camera: '精美水果装饰',
      battery: '48小时内新鲜制作',
    },
    options: {
      colors: [
        { name: '6寸', code: '#ff9fa0', image: '/images/cake_6inch.jpg' },
        { name: '8寸', code: '#ff9fa0', image: '/images/cake_8inch.jpg' },
        { name: '单片', code: '#ff9fa0', image: '/images/cake_slice.jpg' },
      ],
      storage: ['标准甜度', '低糖'],
    },
    inStock: true,
    popularity: 96,
    rating: 4.9,
  },
  
  // 对应Detail04.jpg的商品(马卡龙)
  'p4': {
    name: '缤纷马卡龙礼盒',
    description: '使用法国进口杏仁粉和新鲜食材制作，口感酥脆外表、内馅柔软。礼盒包含6种不同口味：香草、巧克力、覆盆子、开心果、柠檬和玫瑰。精美包装设计，适合送礼和特殊场合。',
    specs: {
      display: '精美礼盒包装',
      connectivity: '6种精选口味',
      sensors: '法国传统工艺',
      waterproof: '48小时新鲜保证',
      battery: '自然食材无添加',
    },
    options: {
      colors: [
        { name: '6枚装', code: '#f4c2d7', image: '/images/macaron_6pc.jpg' },
        { name: '12枚装', code: '#f4c2d7', image: '/images/macaron_12pc.jpg' },
        { name: '定制装', code: '#f4c2d7', image: '/images/macaron_custom.jpg' },
      ],
      size: ['标准', '迷你'],
    },
    inStock: true,
    popularity: 90,
    rating: 4.8,
  },
  
  // 其他商品信息根据Menu.jpg等图片内容提取
  'p5': {
    name: '比利时松露巧克力',
    description: '采用比利时进口可可豆制作，72%黑巧克力外壳包裹丝滑巧克力甘纳许内馅，入口即化。每一颗都由巧克力大师手工精制，带来奢华的味蕾享受。限量供应，口味独特。',
    specs: {
      driver: '比利时进口可可豆',
      noiseCancel: '72%黑巧克力',
      battery: '手工精制',
      connectivity: '松露形状设计',
      microphone: '丝滑甘纳许内馅',
    },
    options: {
      colors: [
        { name: '经典黑巧', code: '#32160e', image: '/images/chocolate_dark.jpg' },
        { name: '海盐焦糖', code: '#6b4226', image: '/images/chocolate_caramel.jpg' },
        { name: '树莓松露', code: '#77202f', image: '/images/chocolate_raspberry.jpg' },
      ],
    },
    inStock: true,
    popularity: 88,
    rating: 4.9,
  },
  
  'p6': {
    name: '手冲精品咖啡',
    description: '源自埃塞俄比亚耶加雪菲高海拔咖啡庄园的精品咖啡豆，每一批都精心挑选和烘焙。采用专业手冲工艺，完美释放花香、果香和巧克力风味。适合想要探索咖啡多样风味的咖啡爱好者。',
    specs: {
      sensor: '埃塞俄比亚耶加雪菲产区',
      iso: '精品咖啡豆评分88+',
      video: '中度烘焙',
      screen: '专业手冲萃取',
      connectivity: '独特风味体验',
    },
    options: {
      kit: ['单杯手冲', '分享壶(3-4人份)', '咖啡豆礼包(200g)'],
    },
    inStock: true,
    popularity: 85,
    rating: 4.8,
  },
  
  'p7': {
    name: '季节水果塔',
    description: '酥脆的黄油塔皮，搭配清爽的香草卡仕达和当季精选水果。每一款都根据时令水果变化，确保最佳新鲜度和口感。外观精美，色彩缤纷，既是甜点也是艺术品。',
    specs: {
      cpu: '优质法国黄油塔皮',
      gpu: '现做香草卡仕达',
      storage: '当季精选水果',
      resolution: '手工装饰',
      frameRate: '4小时内新鲜制作',
    },
    options: {
      bundle: ['迷你塔(4cm)', '标准塔(8cm)', '大型派对款(12cm)'],
      color: ['当季混合水果', '草莓特别版', '蓝莓特别版'],
    },
    inStock: true,
    popularity: 93,
    rating: 4.7,
  },
  
  'p8': {
    name: '招牌下午茶套餐',
    description: '精致的英式下午茶体验，包含自制司康饼、手指三明治、迷你甜点和精选茶品。司康配有自制果酱和德文郡奶油，三明治采用当日新鲜食材，茶品可根据喜好选择。适合2-4人分享。',
    specs: {
      processor: '英式传统配方',
      connectivity: '多层精致托盘',
      control: '手工制作司康和甜点',
      compatibility: '搭配精选茶品',
      features: '2-4人份量',
    },
    options: {
      teatime: ['经典英式', '法式风情', '本地特色'],
      setsize: ['双人套餐', '四人套餐', '派对大餐(6-8人)']
    },
    inStock: true,
    popularity: 97,
    rating: 4.9,
  }
};

// 主函数
async function updateProductDescriptions() {
  // 创建日志流以捕获输出
  const logStream = fs.createWriteStream(LOG_PATH, { flags: 'w' });
  
  const log = (message) => {
    console.log(message);
    logStream.write(message + '\n');
  };
  
  log('==========================================');
  log('  商品描述更新工具 (基于UI目录图片内容)');
  log('==========================================');
  log('开始更新商品描述...\n');
  
  try {
    // 读取原始产品数据
    let productsFileContent = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
    
    // 首先创建一个备份
    fs.writeFileSync(BACKUP_PATH, productsFileContent);
    log(`✅ 已创建备份文件: ${BACKUP_PATH}\n`);
    
    // 解析出products数组
    const productsStartPattern = /const products = \[/;
    const productsStartMatch = productsFileContent.match(productsStartPattern);
    
    if (!productsStartMatch) {
      throw new Error('无法在文件中找到products数组');
    }
    
    // 更新每个产品的描述
    log('正在更新以下商品:');
    log('------------------------------------------');
    
    let updateCount = 0;
    let skipCount = 0;
    
    Object.entries(productUpdates).forEach(([productId, updates]) => {
      // 构建用于查找特定产品的正则表达式
      const productRegex = new RegExp(`\\{\\s*id:\\s*['"']${productId}['"'].*?\\}`, 'gs');
      const productMatch = productsFileContent.match(productRegex);
      
      if (!productMatch) {
        log(`❌ ID: ${productId} - 未找到此商品`);
        skipCount++;
        return;
      }
      
      let productObj = productMatch[0];
      
      // 更新描述
      if (updates.description) {
        productObj = productObj.replace(
          /(description:\s*['"]).*?(['"],)/g,
          `$1${updates.description}$2`
        );
      }
      
      // 更新名称
      if (updates.name) {
        productObj = productObj.replace(
          /(name:\s*['"]).*?(['"],)/g,
          `$1${updates.name}$2`
        );
      }
      
      // 更新规格信息
      if (updates.specs) {
        Object.entries(updates.specs).forEach(([specKey, specValue]) => {
          const specRegex = new RegExp(`(${specKey}:\\s*['"]).*?(['"])`, 'g');
          if (productObj.match(specRegex)) {
            productObj = productObj.replace(specRegex, `$1${specValue}$2`);
          }
        });
      }
      
      // 更新选项信息(如果提供)
      if (updates.options) {
        Object.entries(updates.options).forEach(([optionKey, optionValue]) => {
          // 简单处理，实际可能需要更复杂的替换逻辑
          if (typeof optionValue === 'object' && !Array.isArray(optionValue)) {
            // 对于复杂对象，这里简化处理
            log(`  注意: 为${productId}跳过复杂对象${optionKey}的更新`);
          } else if (Array.isArray(optionValue)) {
            const arrayStart = productObj.indexOf(`${optionKey}: [`);
            if (arrayStart !== -1) {
              // 找到数组结束位置
              let arrayEnd = productObj.indexOf('],', arrayStart);
              if (arrayEnd !== -1) {
                arrayEnd += 1; // 包括]
                // 构造新数组字符串
                const newArrayStr = `${optionKey}: [${optionValue.map(v => typeof v === 'string' ? `'${v}'` : JSON.stringify(v)).join(', ')}]`;
                // 替换数组
                productObj = productObj.substring(0, arrayStart) + newArrayStr + productObj.substring(arrayEnd);
              }
            }
          }
        });
      }
      
      // 将更新后的商品对象替换回原始内容
      productsFileContent = productsFileContent.replace(productRegex, productObj);
      log(`✅ ID: ${productId} - ${updates.name}`);
      updateCount++;
    });
    
    log('------------------------------------------');
    
    // 写入更新后的内容
    fs.writeFileSync(PRODUCTS_FILE_PATH, productsFileContent, 'utf8');
    log(`\n商品描述更新完成!`);
    log(`✅ 成功更新: ${updateCount} 个商品`);
    if (skipCount > 0) {
      log(`⚠️ 跳过: ${skipCount} 个商品 (未找到对应ID)`);
    }
    log('\n更新来源: UI目录中的咖啡和甜品图片内容');
    log('==========================================');
    
    // 关闭日志流
    logStream.end();
    console.log(`\n详细日志已保存至: ${LOG_PATH}`);
    
  } catch (error) {
    console.error('❌ 更新商品描述时出错:', error);
    logStream.write(`❌ 更新商品描述时出错: ${error}\n`);
    console.log('正在尝试恢复备份...');
    
    try {
      if (fs.existsSync(BACKUP_PATH)) {
        fs.copyFileSync(BACKUP_PATH, PRODUCTS_FILE_PATH);
        console.log('✅ 已从备份恢复');
        logStream.write('✅ 已从备份恢复\n');
      }
    } catch (backupError) {
      console.error('❌ 恢复备份失败:', backupError);
      logStream.write(`❌ 恢复备份失败: ${backupError}\n`);
    } finally {
      logStream.end();
    }
  }
}

// 执行更新
updateProductDescriptions();

/**
 * 注意事项：
 * 1. 此脚本主要处理基本的文本替换，如果有复杂的数据结构修改，可能需要手动调整
 * 2. 运行前请确保已备份原始数据文件
 * 3. 对于新增或删除商品的情况，建议直接编辑products.js文件
 * 4. 请注意保持JSON格式正确，特别是引号、逗号等标点符号
 */ 