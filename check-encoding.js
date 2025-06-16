const fs = require('fs');
const path = require('path');

// 检查文件编码
function checkEncoding(filePath) {
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath);
    
    // 检查UTF-8编码中常见的模式
    const isUTF8 = checkUTF8(content);
    
    console.log(`文件: ${filePath}`);
    console.log(`疑似编码: ${isUTF8 ? 'UTF-8' : '可能是GBK或其他编码'}`);
    
    // 创建带BOM的UTF-8版本
    const newPath = `${filePath}.utf8bom`;
    const bomHeader = Buffer.from([0xEF, 0xBB, 0xBF]);
    
    // 如果没有BOM头，则添加
    if (content[0] !== 0xEF || content[1] !== 0xBB || content[2] !== 0xBF) {
      // 将BOM头和内容合并
      const contentWithBOM = Buffer.concat([bomHeader, content]);
      // fs.writeFileSync(newPath, contentWithBOM);
      console.log(`已创建带BOM头的版本: ${newPath} (仅供参考，实际未写入)`);
    }
    
    // 分析文件内容中的中文字符
    const chineseChars = findChineseChars(content.toString('utf8', 0, 500));
    console.log(`文件前500字节中的中文字符: ${chineseChars.length > 0 ? chineseChars.join(', ') : '无中文'}`);
  } catch (err) {
    console.error(`检查文件时出错: ${err.message}`);
  }
}

// 检查是否是UTF-8编码
function checkUTF8(buffer) {
  // UTF-8编码的简单检测 
  // (更严格的检测应该使用完整的UTF-8解码算法)
  let i = 0;
  while (i < buffer.length) {
    if (buffer[i] < 128) {
      // ASCII范围
      i++;
    } else if (buffer[i] >= 194 && buffer[i] <= 223) {
      // 2字节UTF-8序列
      if (i + 1 < buffer.length && buffer[i + 1] >= 128 && buffer[i + 1] <= 191) {
        i += 2;
      } else {
        return false;
      }
    } else if (buffer[i] >= 224 && buffer[i] <= 239) {
      // 3字节UTF-8序列
      if (i + 2 < buffer.length && 
          buffer[i + 1] >= 128 && buffer[i + 1] <= 191 &&
          buffer[i + 2] >= 128 && buffer[i + 2] <= 191) {
        i += 3;
      } else {
        return false;
      }
    } else if (buffer[i] >= 240 && buffer[i] <= 247) {
      // 4字节UTF-8序列
      if (i + 3 < buffer.length && 
          buffer[i + 1] >= 128 && buffer[i + 1] <= 191 &&
          buffer[i + 2] >= 128 && buffer[i + 2] <= 191 &&
          buffer[i + 3] >= 128 && buffer[i + 3] <= 191) {
        i += 4;
      } else {
        return false;
      }
    } else {
      // 不符合UTF-8编码规则
      return false;
    }
  }
  return true;
}

// 查找中文字符
function findChineseChars(str) {
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const matches = str.match(chineseRegex);
  return matches || [];
}

// 要检查的文件列表
const filesToCheck = [
  'src/renderer/App.vue',
  'src/renderer/index.html',
  'webpack.config.js'
];

// 检查所有文件
filesToCheck.forEach(file => {
  try {
    checkEncoding(path.resolve(__dirname, file));
    console.log('-----------------------');
  } catch (e) {
    console.error(`处理文件 ${file} 时出错:`, e);
  }
}); 