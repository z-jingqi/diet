import { Hono } from "hono";
import { eq, and, like, asc, desc, inArray } from "drizzle-orm";
import { TagsQuerySchema, TagsResponseSchema } from "@diet/shared";
import { csrfProtection } from "../middleware/csrf";
import { Bindings } from "@/types/bindings";
import { createDB } from "../db";
import { tagCategories, tags, tagConflicts } from "../db/schema";

const tagsRouter = new Hono<{ Bindings: Bindings }>();

// CSRF 保护中间件 - 应用到所有标签路由
tagsRouter.use("*", csrfProtection);

// 获取所有标签分类
tagsRouter.get("/categories", async (c) => {
  try {
    const db = createDB(c.env.DB);
    
    const categories = await db
      .select({
        id: tagCategories.id,
        name: tagCategories.name,
        description: tagCategories.description,
        sortOrder: tagCategories.sortOrder,
        isActive: tagCategories.isActive,
        createdAt: tagCategories.createdAt,
      })
      .from(tagCategories)
      .where(eq(tagCategories.isActive, true))
      .orderBy(asc(tagCategories.sortOrder));

    return c.json({ categories });
  } catch (error) {
    console.error("Error fetching tag categories:", error);
    return c.json({ error: "Failed to fetch tag categories" }, 500);
  }
});

// 获取所有标签
tagsRouter.get("/", async (c) => {
  try {
    const query = c.req.query();
    const validatedQuery = TagsQuerySchema.parse(query);
    
    const db = createDB(c.env.DB);
    
    let whereConditions = [eq(tags.isActive, true)];
    
    // 添加分类过滤
    if (validatedQuery.categoryId) {
      whereConditions.push(eq(tags.categoryId, validatedQuery.categoryId));
    }
    
    // 添加搜索过滤
    if (validatedQuery.search) {
      whereConditions.push(
        like(tags.name, `%${validatedQuery.search}%`)
      );
    }
    
    const tagsList = await db
      .select({
        id: tags.id,
        name: tags.name,
        description: tags.description,
        categoryId: tags.categoryId,
        restrictions: tags.restrictions,
        aiPrompt: tags.aiPrompt,
        isActive: tags.isActive,
        sortOrder: tags.sortOrder,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
        categoryName: tagCategories.name,
      })
      .from(tags)
      .innerJoin(tagCategories, eq(tags.categoryId, tagCategories.id))
      .where(and(...whereConditions))
      .orderBy(asc(tags.sortOrder), asc(tags.name));

    // 处理 restrictions 字段，将 JSON 字符串转换为数组
    const processedResults = tagsList.map((tag) => ({
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
tagsRouter.get("/all", async (c) => {
  try {
    const db = createDB(c.env.DB);
    
    // 获取分类
    const categories = await db
      .select({
        id: tagCategories.id,
        name: tagCategories.name,
        description: tagCategories.description,
        sortOrder: tagCategories.sortOrder,
        isActive: tagCategories.isActive,
        createdAt: tagCategories.createdAt,
      })
      .from(tagCategories)
      .where(eq(tagCategories.isActive, true))
      .orderBy(asc(tagCategories.sortOrder));

    // 获取标签
    const tagsList = await db
      .select({
        id: tags.id,
        name: tags.name,
        description: tags.description,
        categoryId: tags.categoryId,
        restrictions: tags.restrictions,
        aiPrompt: tags.aiPrompt,
        isActive: tags.isActive,
        sortOrder: tags.sortOrder,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
      })
      .from(tags)
      .where(eq(tags.isActive, true))
      .orderBy(asc(tags.sortOrder), asc(tags.name));

    // 处理数据
    const processedTags = tagsList.map((tag) => ({
      ...tag,
      restrictions:
        tag.restrictions && typeof tag.restrictions === "string"
          ? JSON.parse(tag.restrictions)
          : [],
    }));

    const response = {
      categories,
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

// 获取标签冲突关系
tagsRouter.get("/conflicts", async (c) => {
  try {
    const db = createDB(c.env.DB);
    
    const conflicts = await db
      .select({
        id: tagConflicts.id,
        tagId1: tagConflicts.tagId1,
        tagId2: tagConflicts.tagId2,
        conflictType: tagConflicts.conflictType,
        description: tagConflicts.description,
        createdAt: tagConflicts.createdAt,
      })
      .from(tagConflicts)
      .orderBy(asc(tagConflicts.conflictType), asc(tagConflicts.id));

    return c.json({ conflicts });
  } catch (error) {
    console.error("Error fetching tag conflicts:", error);
    return c.json({ error: "Failed to fetch tag conflicts" }, 500);
  }
});

// 检查标签组合的冲突
tagsRouter.post("/check-conflicts", async (c) => {
  try {
    const body = await c.req.json();
    const { tagIds } = body;
    
    if (!Array.isArray(tagIds)) {
      return c.json({ error: "tagIds must be an array" }, 400);
    }
    
    const db = createDB(c.env.DB);
    
    // 获取所有相关的冲突关系
    const conflicts = await db
      .select({
        id: tagConflicts.id,
        tagId1: tagConflicts.tagId1,
        tagId2: tagConflicts.tagId2,
        conflictType: tagConflicts.conflictType,
        description: tagConflicts.description,
      })
      .from(tagConflicts)
      .where(
        and(
          inArray(tagConflicts.tagId1, tagIds),
          inArray(tagConflicts.tagId2, tagIds)
        )
      );

    // 按冲突类型分组
    const conflictsByType = {
      mutual_exclusive: conflicts.filter(c => c.conflictType === 'mutual_exclusive'),
      warning: conflicts.filter(c => c.conflictType === 'warning'),
      info: conflicts.filter(c => c.conflictType === 'info'),
    };

    return c.json({ 
      conflicts: conflictsByType,
      hasConflicts: conflicts.length > 0,
      totalConflicts: conflicts.length,
    });
  } catch (error) {
    console.error("Error checking tag conflicts:", error);
    return c.json({ error: "Failed to check tag conflicts" }, 500);
  }
});

// 根据标签 ID 获取标签详情
tagsRouter.get("/:id", async (c) => {
  try {
    const tagId = c.req.param("id");
    const db = createDB(c.env.DB);
    
    const tag = await db
      .select({
        id: tags.id,
        name: tags.name,
        description: tags.description,
        categoryId: tags.categoryId,
        restrictions: tags.restrictions,
        aiPrompt: tags.aiPrompt,
        isActive: tags.isActive,
        sortOrder: tags.sortOrder,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
        categoryName: tagCategories.name,
      })
      .from(tags)
      .innerJoin(tagCategories, eq(tags.categoryId, tagCategories.id))
      .where(and(eq(tags.id, tagId), eq(tags.isActive, true)))
      .limit(1);

    if (tag.length === 0) {
      return c.json({ error: "Tag not found" }, 404);
    }

    const processedTag = {
      ...tag[0],
      restrictions:
        tag[0].restrictions && typeof tag[0].restrictions === "string"
          ? JSON.parse(tag[0].restrictions)
          : [],
    };

    return c.json({ tag: processedTag });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return c.json({ error: "Failed to fetch tag" }, 500);
  }
});

export default tagsRouter;
