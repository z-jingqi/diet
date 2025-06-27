import { builder } from '../builder';
import { tagCategories, tags, tagConflicts } from '../../db/schema/tags';
import { eq, and, like, asc, inArray } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

// Drizzle model types
type TagCategoryModel = InferSelectModel<typeof tagCategories>;
type TagModel = InferSelectModel<typeof tags>;
type TagConflictModel = InferSelectModel<typeof tagConflicts>;

// ----------------------
// TagCategory type
// ----------------------
export const TagCategoryRef = builder.objectRef<TagCategoryModel>('TagCategory').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    sortOrder: t.exposeInt('sortOrder', { nullable: true }),
    isActive: t.exposeBoolean('isActive', { nullable: true }),
    createdAt: t.exposeString('createdAt', { nullable: true }),
  }),
});

// ----------------------
// Tag type
// ----------------------
export const TagRef = builder.objectRef<TagModel>('Tag').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    categoryId: t.exposeString('categoryId'),
    aiPrompt: t.exposeString('aiPrompt'),
    sortOrder: t.exposeInt('sortOrder', { nullable: true }),
    isActive: t.exposeBoolean('isActive', { nullable: true }),
    createdAt: t.exposeString('createdAt', { nullable: true }),
    updatedAt: t.exposeString('updatedAt', { nullable: true }),
    
    // Parse restrictions from JSON string
    restrictions: t.field({
      type: ['String'],
      resolve: (parent) => {
        if (!parent.restrictions) return [];
        try {
          return JSON.parse(parent.restrictions) as string[];
        } catch {
          return [];
        }
      },
    }),
    
    category: t.field({
      type: TagCategoryRef,
      resolve: async (parent, _args, ctx) => {
        const [category] = await ctx.db
          .select()
          .from(tagCategories)
          .where(eq(tagCategories.id, parent.categoryId))
          .limit(1);
        return category ?? null;
      },
    }),
  }),
});

// ----------------------
// TagConflict type
// ----------------------
export const TagConflictRef = builder.objectRef<TagConflictModel>('TagConflict').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    tagId1: t.exposeString('tagId1'),
    tagId2: t.exposeString('tagId2'),
    conflictType: t.exposeString('conflictType'),
    description: t.exposeString('description', { nullable: true }),
    createdAt: t.exposeString('createdAt', { nullable: true }),
    
    // Relations
    tag1: t.field({
      type: TagRef,
      resolve: async (parent, _args, ctx) => {
        const [tag] = await ctx.db
          .select()
          .from(tags)
          .where(eq(tags.id, parent.tagId1))
          .limit(1);
        return tag ?? null;
      },
    }),
    
    tag2: t.field({
      type: TagRef,
      resolve: async (parent, _args, ctx) => {
        const [tag] = await ctx.db
          .select()
          .from(tags)
          .where(eq(tags.id, parent.tagId2))
          .limit(1);
        return tag ?? null;
      },
    }),
  }),
});

// ----------------------
// Queries
// ----------------------
builder.queryFields((t) => ({
  // Fetch all active tag categories
  tagCategories: t.field({
    type: [TagCategoryRef],
    resolve: async (_root, _args, ctx) => {
      return await ctx.db
        .select()
        .from(tagCategories)
        .where(eq(tagCategories.isActive, true))
        .orderBy(asc(tagCategories.sortOrder));
    },
  }),

  // Fetch single tag category by ID
  tagCategory: t.field({
    type: TagCategoryRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [category] = await ctx.db
        .select()
        .from(tagCategories)
        .where(eq(tagCategories.id, id as string))
        .limit(1);
      return category ?? null;
    },
  }),

  // Fetch all active tags
  tags: t.field({
    type: [TagRef],
    args: {
      categoryId: t.arg.string({ required: false }),
      search: t.arg.string({ required: false }),
    },
    resolve: async (_root, { categoryId, search }, ctx) => {
      let whereConditions = [eq(tags.isActive, true)];
      
      // 添加分类过滤
      if (categoryId) {
        whereConditions.push(eq(tags.categoryId, categoryId));
      }
      
      // 添加搜索过滤
      if (search) {
        whereConditions.push(like(tags.name, `%${search}%`));
      }
      
      return await ctx.db
        .select()
        .from(tags)
        .where(and(...whereConditions))
        .orderBy(asc(tags.sortOrder), asc(tags.name));
    },
  }),

  // Fetch single tag by ID
  tag: t.field({
    type: TagRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [tag] = await ctx.db
        .select()
        .from(tags)
        .where(eq(tags.id, id as string))
        .limit(1);
      return tag ?? null;
    },
  }),

  // Fetch tags by category
  tagsByCategory: t.field({
    type: [TagRef],
    args: {
      categoryId: t.arg.string({ required: true }),
    },
    resolve: async (_root, { categoryId }, ctx) => {
      return await ctx.db
        .select()
        .from(tags)
        .where(eq(tags.categoryId, categoryId));
    },
  }),

  // Fetch all tag conflicts
  tagConflicts: t.field({
    type: [TagConflictRef],
    resolve: async (_root, _args, ctx) => {
      return await ctx.db
        .select()
        .from(tagConflicts)
        .orderBy(asc(tagConflicts.conflictType), asc(tagConflicts.id));
    },
  }),

  // Check tag conflicts for a set of tag IDs
  checkTagConflicts: t.field({
    type: 'String', // 返回 JSON 字符串格式的冲突信息
    args: {
      tagIds: t.arg.stringList({ required: true }),
    },
    resolve: async (_root, { tagIds }, ctx) => {
      // 获取所有相关的冲突关系
      const conflicts = await ctx.db
        .select()
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

      const result = {
        conflicts: conflictsByType,
        hasConflicts: conflicts.length > 0,
        totalConflicts: conflicts.length,
      };

      return JSON.stringify(result);
    },
  }),
}));

// ----------------------
// Mutations
// ----------------------
builder.mutationFields((t) => ({
  // Create new tag category
  createTagCategory: t.field({
    type: TagCategoryRef,
    args: {
      name: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      sortOrder: t.arg.int({ required: false }),
    },
    resolve: async (_root, { name, description, sortOrder }, ctx) => {
      const [category] = await ctx.db
        .insert(tagCategories)
        .values({
          id: crypto.randomUUID(),
          name,
          description: description ?? null,
          sortOrder: sortOrder ?? 0,
        })
        .returning();
      
      return category;
    },
  }),

  // Update tag category
  updateTagCategory: t.field({
    type: TagCategoryRef,
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string({ required: false }),
      description: t.arg.string({ required: false }),
      sortOrder: t.arg.int({ required: false }),
    },
    resolve: async (_root, { id, name, description, sortOrder }, ctx) => {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

      const [category] = await ctx.db
        .update(tagCategories)
        .set(updateData)
        .where(eq(tagCategories.id, id as string))
        .returning();
      
      return category ?? null;
    },
  }),

  // Delete tag category
  deleteTagCategory: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [category] = await ctx.db
        .delete(tagCategories)
        .where(eq(tagCategories.id, id as string))
        .returning();
      
      return !!category;
    },
  }),

  // Create new tag
  createTag: t.field({
    type: TagRef,
    args: {
      name: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      categoryId: t.arg.string({ required: true }),
      restrictions: t.arg.stringList({ required: false }),
      aiPrompt: t.arg.string({ required: true }),
      sortOrder: t.arg.int({ required: false }),
    },
    resolve: async (_root, { name, description, categoryId, restrictions, aiPrompt, sortOrder }, ctx) => {
      const [tag] = await ctx.db
        .insert(tags)
        .values({
          id: crypto.randomUUID(),
          name,
          description,
          categoryId,
          restrictions: restrictions ? JSON.stringify(restrictions) : null,
          aiPrompt,
          sortOrder: sortOrder ?? 0,
        })
        .returning();
      
      return tag;
    },
  }),

  // Update tag
  updateTag: t.field({
    type: TagRef,
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string({ required: false }),
      description: t.arg.string({ required: false }),
      restrictions: t.arg.stringList({ required: false }),
      aiPrompt: t.arg.string({ required: false }),
      sortOrder: t.arg.int({ required: false }),
    },
    resolve: async (_root, { id, name, description, restrictions, aiPrompt, sortOrder }, ctx) => {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (restrictions !== undefined) updateData.restrictions = JSON.stringify(restrictions);
      if (aiPrompt !== undefined) updateData.aiPrompt = aiPrompt;
      if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
      updateData.updatedAt = new Date().toISOString();

      const [tag] = await ctx.db
        .update(tags)
        .set(updateData)
        .where(eq(tags.id, id as string))
        .returning();
      
      return tag ?? null;
    },
  }),

  // Delete tag
  deleteTag: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [tag] = await ctx.db
        .delete(tags)
        .where(eq(tags.id, id as string))
        .returning();
      
      return !!tag;
    },
  }),

  // Create tag conflict
  createTagConflict: t.field({
    type: TagConflictRef,
    args: {
      tagId1: t.arg.string({ required: true }),
      tagId2: t.arg.string({ required: true }),
      conflictType: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_root, { tagId1, tagId2, conflictType, description }, ctx) => {
      const [conflict] = await ctx.db
        .insert(tagConflicts)
        .values({
          id: crypto.randomUUID(),
          tagId1,
          tagId2,
          conflictType,
          description: description ?? null,
        })
        .returning();
      
      return conflict;
    },
  }),

  // Delete tag conflict
  deleteTagConflict: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [conflict] = await ctx.db
        .delete(tagConflicts)
        .where(eq(tagConflicts.id, id as string))
        .returning();
      
      return !!conflict;
    },
  }),
})); 
