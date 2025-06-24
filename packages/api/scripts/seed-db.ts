import { seedDatabase } from '../src/db/seed.js';

// 模拟D1数据库接口
interface D1Database {
  prepare: (query: string) => any;
  batch: (statements: any[]) => Promise<any[]>;
  exec: (query: string) => Promise<any>;
}

// 创建模拟数据库实例
const mockD1: D1Database = {
  prepare: (query: string) => {
    console.log('Preparing query:', query);
    return {
      bind: (...args: any[]) => ({ run: () => Promise.resolve() }),
      run: () => Promise.resolve(),
    };
  },
  batch: (statements: any[]) => {
    console.log('Executing batch:', statements.length, 'statements');
    return Promise.resolve([]);
  },
  exec: (query: string) => {
    console.log('Executing query:', query);
    return Promise.resolve();
  },
};

// 执行种子数据插入
async function main() {
  try {
    console.log('🚀 开始执行数据库种子数据...');
    await seedDatabase(mockD1);
    console.log('✅ 种子数据执行完成！');
  } catch (error) {
    console.error('❌ 种子数据执行失败:', error);
    process.exit(1);
  }
}

main(); 