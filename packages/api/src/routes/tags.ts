import { Hono } from "hono";
import type { Bindings } from "../index";
import { TagsQuerySchema, TagsResponseSchema } from "@shared/schemas";

const tags = new Hono<{ Bindings: Bindings }>();

// 获取所有标签分类
tags.get("/categories", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `
      SELECT 
        id,
        name,
        description,
        sort_order as sortOrder,
        is_active as isActive,
        created_at as createdAt
      FROM tag_categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC
    `
    ).all();

    return c.json({ categories: results });
  } catch (error) {
    console.error("Error fetching tag categories:", error);
    return c.json({ error: "Failed to fetch tag categories" }, 500);
  }
});

// 获取所有标签
tags.get("/", async (c) => {
  try {
    const query = c.req.query();
    const validatedQuery = TagsQuerySchema.parse(query);

    let sql = `
      SELECT 
        t.id,
        t.name,
        t.description,
        t.category_id as categoryId,
        t.restrictions,
        t.ai_prompt as aiPrompt,
        t.is_active as isActive,
        t.sort_order as sortOrder,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        tc.name as categoryName
      FROM tags t
      JOIN tag_categories tc ON t.category_id = tc.id
      WHERE t.is_active = true
    `;

    const params: any[] = [];

    // 添加分类过滤
    if (validatedQuery.categoryId) {
      sql += " AND t.category_id = ?";
      params.push(validatedQuery.categoryId);
    }

    // 添加搜索过滤
    if (validatedQuery.search) {
      sql += " AND (t.name LIKE ? OR t.description LIKE ?)";
      const searchTerm = `%${validatedQuery.search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += " ORDER BY t.sort_order ASC, t.name ASC";

    const { results } = await c.env.DB.prepare(sql)
      .bind(...params)
      .all();

    // 处理 restrictions 字段，将 JSON 字符串转换为数组
    const processedResults = results.map((tag: any) => ({
      ...tag,
      restrictions: tag.restrictions ? JSON.parse(tag.restrictions) : [],
    }));

    return c.json({ tags: processedResults });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return c.json({ error: "Failed to fetch tags" }, 500);
  }
});

// 获取标签和分类的完整数据
tags.get("/all", async (c) => {
  try {
    // 获取分类
    const { results: categories } = await c.env.DB.prepare(`
      SELECT 
        id,
        name,
        description,
        sort_order as sortOrder,
        is_active as isActive,
        created_at as createdAt
      FROM tag_categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC
    `).all();

    // 获取标签
    const { results: tags } = await c.env.DB.prepare(`
      SELECT 
        id,
        name,
        description,
        category_id as categoryId,
        restrictions,
        ai_prompt as aiPrompt,
        is_active as isActive,
        sort_order as sortOrder,
        created_at as createdAt,
        updated_at as updatedAt
      FROM tags 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `).all();

    // 处理数据，将数字布尔值转换为布尔值
    const processedCategories = categories.map((category: any) => ({
      ...category,
      isActive: Boolean(category.isActive),
    }));

    const processedTags = tags.map((tag: any) => ({
      ...tag,
      restrictions: tag.restrictions && typeof tag.restrictions === 'string' ? JSON.parse(tag.restrictions) : [],
      isActive: Boolean(tag.isActive),
    }));

    const response = {
      categories: processedCategories,
      tags: processedTags,
    };

    // 验证响应数据
    const validatedResponse = TagsResponseSchema.parse(response);
    return c.json(validatedResponse);
  } catch (error) {
    console.error("Error fetching all tags data:", error);
    return c.json({ error: "Failed to fetch tags data" }, 500);
  }
});

// 根据标签 ID 获取标签详情
tags.get("/:id", async (c) => {
  try {
    const tagId = c.req.param("id");

    const { results } = await c.env.DB.prepare(
      `
      SELECT 
        t.id,
        t.name,
        t.description,
        t.category_id as categoryId,
        t.restrictions,
        t.ai_prompt as aiPrompt,
        t.is_active as isActive,
        t.sort_order as sortOrder,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        tc.name as categoryName
      FROM tags t
      JOIN tag_categories tc ON t.category_id = tc.id
      WHERE t.id = ? AND t.is_active = true
    `
    )
      .bind(tagId)
      .all();

    if (results.length === 0) {
      return c.json({ error: "Tag not found" }, 404);
    }

    const tag = results[0];
    const processedTag = {
      ...tag,
      restrictions: tag.restrictions && typeof tag.restrictions === 'string' ? JSON.parse(tag.restrictions) : [],
    };

    return c.json({ tag: processedTag });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return c.json({ error: "Failed to fetch tag" }, 500);
  }
});

export default tags;
