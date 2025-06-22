import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检查是否要执行到远程数据库
const isRemote = process.argv.includes('--remote');

// 数据库初始化脚本 - 分别执行每个 SQL 文件
async function initDatabase(): Promise<void> {
  const schemaDir = path.join(__dirname, '../schema');
  
  // 定义要执行的 SQL 文件及其执行顺序
  const sqlFiles: string[] = [
    'users.sql',
    'tags.sql'
    // 可以继续添加更多文件
  ];

  console.log(`🚀 开始初始化数据库... ${isRemote ? '(远程)' : '(本地)'}\n`);

  for (const file of sqlFiles) {
    const filePath = path.join(schemaDir, file);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.error(`❌ 文件不存在: ${file}`);
      continue;
    }

    try {
      console.log(`📄 执行文件: ${file}`);
      
      // 构建命令，根据是否远程添加 --remote 标志
      const remoteFlag = isRemote ? ' --remote' : '';
      const command = `npx wrangler d1 execute DB --file=${filePath}${remoteFlag}`;
      
      const result = execSync(command, { 
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(`✅ ${file} 执行成功`);
      console.log(result);
      console.log('---\n');
      
    } catch (error) {
      console.error(`❌ ${file} 执行失败:`);
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      console.log('---\n');
      
      // 可以选择是否继续执行其他文件
      // 如果希望一个文件失败就停止，可以在这里 break
      // break;
    }
  }

  console.log('🎉 数据库初始化完成！');
}

// 执行初始化
initDatabase().catch(console.error);

// 如果直接运行此脚本
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 在开发环境中，这里可以添加本地数据库初始化逻辑
  console.log('Database initialization script loaded');
} 