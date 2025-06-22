import { D1Database } from '@cloudflare/workers-types';

// 读取SQL文件内容
async function readSqlFile(path: string): Promise<string> {
  const response = await fetch(path);
  return await response.text();
}

// 执行SQL语句
async function executeSql(db: D1Database, sql: string): Promise<void> {
  try {
    const result = await db.prepare(sql).run();
    console.log('SQL executed successfully:', result);
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
}

// 初始化数据库
export async function initDatabase(db: D1Database): Promise<void> {
  console.log('Starting database initialization...');

  try {
    // 读取并执行用户表SQL
    const usersSql = await readSqlFile('./schema/users.sql');
    await executeSql(db, usersSql);
    console.log('Users tables created successfully');

    // 读取并执行标签表SQL
    const tagsSql = await readSqlFile('./schema/tags.sql');
    await executeSql(db, tagsSql);
    console.log('Tags tables created successfully');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 在开发环境中，这里可以添加本地数据库初始化逻辑
  console.log('Database initialization script loaded');
} 