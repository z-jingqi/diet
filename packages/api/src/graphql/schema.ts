import { builder } from './builder';
import './types/tags';

// 定义根查询类型
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => 'Hello GraphQL from Pothos!',
    }),
  }),
});

// 导出 GraphQL Schema
export const schema = builder.toSchema(); 
