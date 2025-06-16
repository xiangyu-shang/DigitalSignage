/**
 * @file vue-template-fix.js
 * @description 修复Vue模板解析问题，特别是处理中文和特殊字符
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * 检查并修复文件编码及BOM头
 * @param {string} filePath - 文件路径
 */
function fixFileEncoding(filePath) {
  console.log(`处理文件: ${filePath}`);
  let content = fs.readFileSync(filePath);
  
  // 检查是否有BOM头
  const hasBOM = content.length >= 3 && 
                content[0] === 0xEF && 
                content[1] === 0xBB && 
                content[2] === 0xBF;
  
  // 如果有BOM头，去除它
  if (hasBOM) {
    console.log(`  - 检测到BOM头，将去除`);
    content = content.slice(3);
  }
  
  // 转换为字符串
  let textContent = content.toString('utf8');
  
  // 处理特殊模板表达式，避免解析错误
  if (filePath.endsWith('.vue') || filePath.endsWith('.js')) {
    // 检查并修复Vue模板中的表达式
    textContent = fixVueTemplateExpressions(textContent);
  }
  
  // 写回文件
  fs.writeFileSync(filePath, textContent, { encoding: 'utf8' });
  console.log(`  - 已保存修复后的文件`);
}

/**
 * 修复Vue模板中的表达式
 * @param {string} content - 模板内容
 * @returns {string} 修复后的内容
 */
function fixVueTemplateExpressions(content) {
  // 匹配模板中的表达式 {{ ... }}
  const expressionRegex = /{{([\s\S]*?)}}/g;
  
  // 记录是否进行了修改
  let modified = false;
  
  // 替换可能有问题的表达式
  const result = content.replace(expressionRegex, (match, expr) => {
    // 检查表达式中是否包含中文
    if (/[\u4e00-\u9fa5]/.test(expr)) {
      modified = true;
      console.log(`  - 检测到包含中文的表达式: ${match.trim()}`);
      // 提供更安全的表达式格式
      return `{{ ${expr.trim()} }}`;
    }
    return match;
  });
  
  if (modified) {
    console.log('  - 已修复模板表达式');
  }
  
  return result;
}

/**
 * 处理所有相关文件
 */
function processVueFiles() {
  // 获取所有Vue文件
  const vueFiles = glob.sync('src/**/*.vue', { nodir: true });
  console.log(`找到 ${vueFiles.length} 个Vue文件`);
  
  // 逐个处理
  vueFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    fixFileEncoding(filePath);
  });
  
  console.log('所有Vue文件处理完成!');
}

/**
 * 主函数
 */
function main() {
  console.log('开始修复Vue模板解析问题...');
  
  // 如果命令行参数指定了特定文件
  if (process.argv.length > 2) {
    const filePath = path.resolve(process.cwd(), process.argv[2]);
    if (fs.existsSync(filePath)) {
      fixFileEncoding(filePath);
    } else {
      console.error(`错误: 文件 ${filePath} 不存在`);
    }
  } else {
    // 否则处理所有Vue文件
    processVueFiles();
  }
}

// 执行主函数
main(); 