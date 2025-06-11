const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  // 要处理的根目录
  rootDir: path.join(__dirname, '../packages/client/src'),
  // 要处理的子目录（相对于 rootDir）
  targetDirs: ['components', 'pages'],
  // 是否只处理 .tsx 文件
  onlyTsx: true,
};

// 将 kebab-case 转换为 PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// 获取所有 TypeScript/JavaScript 文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (config.onlyTsx ? file.endsWith('.tsx') : (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 更新文件中的引用
function updateImports(filePath, oldName, newName) {
  let content = fs.readFileSync(filePath, 'utf8');
  const oldImportPath = oldName.replace(/\.tsx?$/, '');
  const newImportPath = newName.replace(/\.tsx?$/, '');
  
  // 更新 import 语句
  content = content.replace(
    new RegExp(`from ['"]@/([^'"]*?)/${oldImportPath}['"]`, 'g'),
    `from '@/$1/${newImportPath}'`
  );
  
  // 更新 require 语句
  content = content.replace(
    new RegExp(`require\\(['"]@/([^'"]*?)/${oldImportPath}['"]\\)`, 'g'),
    `require('@/$1/${newImportPath}')`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
}

// 主函数
function renameComponents() {
  // 获取所有目标目录的文件
  const files = config.targetDirs.reduce((acc, dir) => {
    const targetDir = path.join(config.rootDir, dir);
    if (fs.existsSync(targetDir)) {
      return [...acc, ...getAllFiles(targetDir)];
    }
    return acc;
  }, []);
  
  // 创建重命名映射
  const renameMap = new Map();
  
  // 第一步：收集所有需要重命名的文件
  files.forEach(filePath => {
    const dirName = path.dirname(filePath);
    const fileName = path.basename(filePath);
    
    // 跳过已经是 PascalCase 的文件
    if (fileName === toPascalCase(fileName)) {
      return;
    }
    
    const newFileName = toPascalCase(fileName);
    const newFilePath = path.join(dirName, newFileName);
    
    renameMap.set(filePath, newFilePath);
  });
  
  if (renameMap.size === 0) {
    console.log('No files need to be renamed.');
    return;
  }
  
  console.log(`Found ${renameMap.size} files to rename:`);
  renameMap.forEach((newPath, oldPath) => {
    console.log(`  ${oldPath} -> ${newPath}`);
  });
  
  // 询问用户是否继续
  console.log('\nDo you want to proceed with renaming? (y/n)');
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('', (answer) => {
    if (answer.toLowerCase() === 'y') {
      // 第二步：重命名文件
      renameMap.forEach((newPath, oldPath) => {
        try {
          // 使用 git mv 来保持 Git 历史
          execSync(`git mv "${oldPath}" "${newPath}"`, { stdio: 'inherit' });
          console.log(`Renamed: ${oldPath} -> ${newPath}`);
        } catch (error) {
          console.error(`Error renaming ${oldPath}:`, error.message);
        }
      });
      
      // 第三步：更新所有文件中的引用
      const allFiles = getAllFiles(config.rootDir);
      renameMap.forEach((newPath, oldPath) => {
        const oldName = path.basename(oldPath);
        const newName = path.basename(newPath);
        
        allFiles.forEach(filePath => {
          try {
            updateImports(filePath, oldName, newName);
            console.log(`Updated imports in: ${filePath}`);
          } catch (error) {
            console.error(`Error updating imports in ${filePath}:`, error.message);
          }
        });
      });
      
      console.log('\nComponent renaming completed successfully!');
    } else {
      console.log('\nOperation cancelled by user.');
    }
    readline.close();
  });
}

// 运行脚本
try {
  renameComponents();
} catch (error) {
  console.error('Error running script:', error);
  process.exit(1);
} 
