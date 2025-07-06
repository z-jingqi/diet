import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 种子数据 SQL 文件路径
const seedDataPath = path.join(__dirname, '../src/db/seed-data.sql');

async function seedRemoteDatabase() {
  try {
    // 根据环境变量确定目标数据库
    const targetEnv = process.env.TARGET_ENV || 'dev'; // 默认 dev
    const envFlag = targetEnv === 'prod' ? '' : `--env ${targetEnv}-remote`;
    
    console.log(`🚀 开始更新${targetEnv === 'prod' ? '生产' : '开发'}数据库...`);
    
    // 第一步：清理现有数据（按外键依赖顺序）
    console.log('🧹 清理现有数据...');
    const clearCommands = [
      'DELETE FROM tag_conflicts;',  // 先删除冲突关系
      'DELETE FROM tags;',           // 再删除标签
      'DELETE FROM tag_categories;'  // 最后删除分类
    ];
    
    for (const clearCommand of clearCommands) {
      try {
        const clearSql = `npx wrangler d1 execute DB ${envFlag} --remote --command="${clearCommand}"`;
        console.log(`执行清理命令: ${clearCommand}`);
        execSync(clearSql, { 
          cwd: path.join(__dirname, '../..'),
          encoding: 'utf8',
          stdio: 'pipe'
        });
      } catch (clearError) {
        console.log(`清理命令执行结果: ${clearError instanceof Error ? clearError.message : '未知错误'}`);
        // 继续执行，因为表可能本来就是空的
      }
    }
    
    console.log('✅ 现有数据清理完成');
    
    // 第二步：插入新的种子数据
    console.log('🌱 插入新的种子数据...');
    const command = `npx wrangler d1 execute DB ${envFlag} --remote --file=${seedDataPath}`;
    
    console.log(`执行插入命令: ${command}`);
    const result = execSync(command, { 
      cwd: path.join(__dirname, '../..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ 远程数据库更新成功！');
    console.log(result);
    
  } catch (error) {
    console.error('❌ 远程数据库更新失败:', error);
    if (error instanceof Error) {
      console.error('错误信息:', error.message);
    }
    process.exit(1);
  }
}

seedRemoteDatabase(); 