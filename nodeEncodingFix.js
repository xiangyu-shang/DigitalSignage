// 配置Node.js环境编码
process.env.LANG = 'zh_CN.UTF-8';
process.env.LC_ALL = 'zh_CN.UTF-8';
process.env.LC_CTYPE = 'zh_CN.UTF-8';

// 检查当前环境配置
console.log('当前环境编码配置:');
console.log('LANG:', process.env.LANG);
console.log('LC_ALL:', process.env.LC_ALL);
console.log('LC_CTYPE:', process.env.LC_CTYPE);
console.log('Node.js 版本:', process.version);

// 尝试输出中文
console.log('测试中文输出: 中文文字测试');

// 导出设置函数供其他模块使用
module.exports = function setupEncoding() {
  process.env.LANG = 'zh_CN.UTF-8';
  process.env.LC_ALL = 'zh_CN.UTF-8';
  process.env.LC_CTYPE = 'zh_CN.UTF-8';
  
  // 设置控制台输出编码
  if (process.stdout.isTTY) {
    try {
      process.stdout.setEncoding('utf8');
      console.log('已设置控制台输出编码为UTF-8');
    } catch (e) {
      console.error('设置控制台编码失败:', e.message);
    }
  }
  
  return {
    LANG: process.env.LANG,
    LC_ALL: process.env.LC_ALL,
    LC_CTYPE: process.env.LC_CTYPE
  };
}; 