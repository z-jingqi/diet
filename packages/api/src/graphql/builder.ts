import SchemaBuilder from '@pothos/core';
import type { DB } from '../db';
import type { GraphQLContext } from './middleware/auth';

// 为 Pothos 定义上下文类型
export interface PothosTypes {
  Context: GraphQLContext;
}

// 创建 SchemaBuilder 实例
export const builder = new SchemaBuilder<PothosTypes>({}); 
