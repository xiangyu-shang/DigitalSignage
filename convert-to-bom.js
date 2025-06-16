const fs = require('fs');
const path = require('path');

// 需要添加BOM的文件列表
const filesToConvert = [
  'src/renderer/App.vue',
  'src/renderer/main.js',
  'src/renderer/index.html',
  'webpack.config.js',
  // ... any other files ...
];

// 添加BOM头
function addBOMHeader(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    
    // 读取原始文件
    const content = fs.readFileSync(filePath);
    
    // 检查是否已有BOM头
    if (content.length >= 3 && content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
      console.log(`- 文件已有BOM头，无需处理`);
      return;
    }
    
    // 创建备份
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, content);
    console.log(`- 已创建备份: ${backupPath}`);
    
    // 添加BOM头
    const bomHeader = Buffer.from([0xEF, 0xBB, 0xBF]);
    const contentWithBOM = Buffer.concat([bomHeader, content]);
    
    // 写回原文件
    fs.writeFileSync(filePath, contentWithBOM);
    console.log(`- 已添加BOM头`);
  } catch (err) {
    console.error(`处理文件时出错: ${filePath}, ${err.message}`);
  }
}

// 处理所有文件
filesToConvert.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  if (fs.existsSync(fullPath)) {
    addBOMHeader(fullPath);
    console.log('-----------------------');
  } else {
    console.log(`文件不存在: ${fullPath}`);
  }
}); 