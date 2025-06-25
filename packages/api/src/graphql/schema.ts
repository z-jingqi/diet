import { builder } from './builder';
import './types/tags';
import './types/chat';
import './types/auth';

// 定义根查询类型
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => 'Hello GraphQL from Pothos!',
    }),
  }),
});

// 定义根变更类型
builder.mutationType({
  fields: (t) => ({
    // 这里可以为空，因为具体的 mutations 已经在各个类型文件中定义了
  }),
});

// 导出 GraphQL Schema
export const schema = builder.toSchema(); 
