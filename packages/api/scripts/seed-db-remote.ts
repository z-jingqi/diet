import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 种子数据 SQL 文件路径
const seedDataPath = path.join(__dirname, '../src/db/seed-data.sql');

async function seedRemoteDatabase() {
  try {
    console.log('🚀 开始向远程数据库插入种子数据...');
    
    // 使用 wrangler 执行种子数据 SQL 文件
    const command = `npx wrangler d1 execute DB --remote --file=${seedDataPath}`;
    
    console.log(`执行命令: ${command}`);
    const result = execSync(command, { 
      cwd: path.join(__dirname, '../..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ 种子数据插入成功！');
    console.log(result);
    
  } catch (error) {
    console.error('❌ 种子数据插入失败:', error);
    if (error instanceof Error) {
      console.error('错误信息:', error.message);
    }
    process.exit(1);
  }
}

seedRemoteDatabase(); 