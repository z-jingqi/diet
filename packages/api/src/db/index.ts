import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Cloudflare D1 数据库类型
declare global {
  interface D1Database {
    prepare: (query: string) => any;
    batch: (statements: any[]) => Promise<any[]>;
    exec: (query: string) => Promise<any>;
  }
}

// 数据库连接函数
export function createDB(d1: D1Database) {
  return drizzle(d1, { schema });
}

// 导出所有 schema
export * from './schema';

// 导出类型
export type DB = ReturnType<typeof createDB>; 