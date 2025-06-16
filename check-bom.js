const fs = require('fs');
const path = require('path');

// 检查文件是否有BOM头
function checkBOM(filePath) {
  try {
    const buffer = Buffer.alloc(3);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 3, 0);
    fs.closeSync(fd);
    
    const hasBOM = buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF;
    console.log(`文件: ${filePath}`);
    console.log(`是否有BOM头: ${hasBOM ? '是' : '否'}`);
    return hasBOM;
  } catch (err) {
    console.error(`检查文件时出错: ${err.message}`);
    return false;
  }
}

// 要检查的文件列表
const filesToCheck = [
  'src/renderer/App.vue',
  'src/renderer/index.html',
  'webpack.config.js'
];

// 检查所有文件
filesToCheck.forEach(file => {
  checkBOM(path.resolve(__dirname, file));
  console.log('-----------------------');
}); 