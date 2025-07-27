import { z } from "zod";

// 标签分类 Schema
export const TagCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
});

// 标签 Schema
export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  categoryId: z.string(),
  restrictions: z.array(z.string()).optional(),
  aiPrompt: z.string(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 标签分类类型
export type TagCategory = z.infer<typeof TagCategorySchema>;

// 标签类型
export type Tag = z.infer<typeof TagSchema>;

// 标签查询参数
export const TagsQuerySchema = z.object({
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export type TagsQuery = z.infer<typeof TagsQuerySchema>;

// 标签响应
export const TagsResponseSchema = z.object({
  categories: z.array(TagCategorySchema),
  tags: z.array(TagSchema),
});

export type TagsResponse = z.infer<typeof TagsResponseSchema>;
