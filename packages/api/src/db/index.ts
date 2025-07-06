import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { D1Database } from '@cloudflare/workers-types';

// 数据库连接函数
export function createDB(d1: D1Database) {
  return drizzle(d1, { schema });
}

// 导出所有 schema
export * from './schema';

// 导出类型
export type DB = ReturnType<typeof createDB>; 