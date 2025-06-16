const fs = require('fs');
const path = require('path');

// 需要检查的文件列表
const filesToCheck = [
  'src/renderer/App.vue',
  'src/renderer/main.js',
  'src/renderer/index.html',
  'webpack.config.js',
  // ... any other files ...
];

// 移除BOM头
function removeBOMHeader(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    
    // 读取原始文件
    const content = fs.readFileSync(filePath);
    
    // 检查是否有BOM头
    if (content.length < 3 || content[0] !== 0xEF || content[1] !== 0xBB || content[2] !== 0xBF) {
      console.log(`- 文件没有BOM头，无需处理`);
      return;
    }
    
    // 创建备份
    const backupPath = `${filePath}.withbom`;
    fs.writeFileSync(backupPath, content);
    console.log(`- 已创建备份: ${backupPath}`);
    
    // 移除BOM头
    const contentWithoutBOM = Buffer.from(content.slice(3));
    
    // 写回原文件
    fs.writeFileSync(filePath, contentWithoutBOM);
    console.log(`- 已移除BOM头`);
  } catch (err) {
    console.error(`处理文件时出错: ${filePath}, ${err.message}`);
  }
}

// 处理所有文件
filesToCheck.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  if (fs.existsSync(fullPath)) {
    removeBOMHeader(fullPath);
    console.log('-----------------------');
  } else {
    console.log(`文件不存在: ${fullPath}`);
  }
}); 