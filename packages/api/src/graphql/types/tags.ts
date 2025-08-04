import { builder } from "../builder";
import { tag_categories, tags, tag_conflicts } from "../../db/schema/tags";
import { eq, asc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { DateTimeScalar } from "../builder";

// Drizzle model types
type TagCategoryModel = InferSelectModel<typeof tag_categories>;
type TagModel = InferSelectModel<typeof tags>;
type TagConflictModel = InferSelectModel<typeof tag_conflicts>;

// ----------------------
// TagCategory type
// ----------------------
export const TagCategoryRef = builder
  .objectRef<TagCategoryModel>("TagCategory")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      name: t.exposeString("name"),
      description: t.exposeString("description", { nullable: true }),
      sortOrder: t.exposeInt("sort_order", { nullable: true }),
      isActive: t.exposeBoolean("is_active", { nullable: true }),
      createdAt: t.expose("created_at", {
        type: DateTimeScalar,
        nullable: true,
      }),
    }),
  });

// ----------------------
// Tag type
// ----------------------
export const TagRef = builder.objectRef<TagModel>("Tag").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    categoryId: t.exposeString("category_id"),
    aiPrompt: t.exposeString("ai_prompt", { nullable: true }),
    sortOrder: t.exposeInt("sort_order", { nullable: true }),
    isActive: t.exposeBoolean("is_active", { nullable: true }),
    createdAt: t.expose("created_at", { type: DateTimeScalar, nullable: true }),
    updatedAt: t.expose("updated_at", { type: DateTimeScalar, nullable: true }),
    restrictions: t.field({
      type: ["String"],
      nullable: true,
      resolve: (parent) => {
        if (!parent.restrictions) return null;
        try {
          return JSON.parse(parent.restrictions);
        } catch {
          return null;
        }
      },
    }),

    // Relations
    category: t.field({
      type: TagCategoryRef,
      resolve: async (parent, _args, ctx) => {
        const [category] = await ctx.db
          .select()
          .from(tag_categories)
          .where(eq(tag_categories.id, parent.category_id))
          .limit(1);
        return category ?? null;
      },
    }),
  }),
});

// Add tags relation to TagCategory after TagRef is defined
builder.objectField(TagCategoryRef, "tags", (t) =>
  t.field({
    type: [TagRef],
    resolve: async (parent, _args, ctx) => {
      return await ctx.db
        .select()
        .from(tags)
        .where(eq(tags.category_id, parent.id))
        .orderBy(asc(tags.sort_order), asc(tags.name));
    },
  }),
);

// ----------------------
// TagConflict type
// ----------------------
export const TagConflictRef = builder
  .objectRef<TagConflictModel>("TagConflict")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      tagId1: t.exposeString("tag_id_1"),
      tagId2: t.exposeString("tag_id_2"),
      conflictType: t.exposeString("conflict_type"),
      description: t.exposeString("description", { nullable: true }),
      createdAt: t.expose("created_at", {
        type: DateTimeScalar,
        nullable: true,
      }),
    }),
  });

// Add tag relations to TagConflict after TagRef is defined
builder.objectField(TagConflictRef, "tag1", (t) =>
  t.field({
    type: TagRef,
    resolve: async (parent, _args, ctx) => {
      const [tag] = await ctx.db
        .select()
        .from(tags)
        .where(eq(tags.id, parent.tag_id_1))
        .limit(1);
      return tag ?? null;
    },
  }),
);

builder.objectField(TagConflictRef, "tag2", (t) =>
  t.field({
    type: TagRef,
    resolve: async (parent, _args, ctx) => {
      const [tag] = await ctx.db
        .select()
        .from(tags)
        .where(eq(tags.id, parent.tag_id_2))
        .limit(1);
      return tag ?? null;
    },
  }),
);

// ----------------------
// Queries
// ----------------------
builder.queryFields((t) => ({
  // Fetch all tag categories
  tagCategories: t.field({
    type: [TagCategoryRef],
    resolve: (_r, _a, ctx) => ctx.services.tag.listCategories(),
  }),

  // Fetch a specific tag category
  tagCategory: t.field({
    type: TagCategoryRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_r, { id }, ctx) => ctx.services.tag.getCategory(id),
  }),

  // Fetch all tags
  tags: t.field({
    type: [TagRef],
    args: {
      categoryId: t.arg.id(),
      search: t.arg.string(),
    },
    resolve: (_r, args, ctx) =>
      ctx.services.tag.listTags({
        categoryId: args.categoryId ?? undefined,
        search: args.search ?? undefined,
      }),
  }),

  // Fetch a specific tag
  tag: t.field({
    type: TagRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_r, { id }, ctx) => ctx.services.tag.getTag(id),
  }),

  // Fetch tags by category
  tagsByCategory: t.field({
    type: [TagRef],
    args: {
      categoryId: t.arg.id({ required: true }),
    },
    resolve: (_r, { categoryId }, ctx) =>
      ctx.services.tag.getTagsByCategory(categoryId),
  }),

  // Fetch all tag conflicts
  tagConflicts: t.field({
    type: [TagConflictRef],
    resolve: (_r, _a, ctx) => ctx.services.tag.listConflicts(),
  }),

  // Check tag conflicts for a set of tag IDs
  checkTagConflicts: t.field({
    type: "String", // 返回 JSON 字符串格式的冲突信息
    args: {
      tagIds: t.arg.idList({ required: true }),
    },
    resolve: async (_root, { tagIds }, ctx) => {
      const res = await ctx.services.tag.checkConflicts(tagIds);
      return JSON.stringify(res);
    },
  }),
}));

// ----------------------
// Mutations
// ----------------------
builder.mutationFields((t) => ({
  // Create tag category
  createTagCategory: t.field({
    type: TagCategoryRef,
    args: {
      name: t.arg.string({ required: true }),
      description: t.arg.string(),
      sortOrder: t.arg.int(),
    },
    resolve: (_r, args, ctx) =>
      ctx.services.tag.createCategory({
        name: args.name,
        description: args.description ?? null,
        sortOrder: args.sortOrder ?? undefined,
      }),
  }),

  // Update tag category
  updateTagCategory: t.field({
    type: TagCategoryRef,
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string(),
      description: t.arg.string(),
      sortOrder: t.arg.int(),
    },
    resolve: (_r, args, ctx) =>
      ctx.services.tag.updateCategory(args.id, {
        name: args.name ?? undefined,
        description: args.description ?? undefined,
        sortOrder: args.sortOrder ?? undefined,
      }),
  }),

  // Delete tag category
  deleteTagCategory: t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_r, { id }, ctx) => ctx.services.tag.deleteCategory(id),
  }),

  // Create tag
  createTag: t.field({
    type: TagRef,
    args: {
      name: t.arg.string({ required: true }),
      description: t.arg.string(),
      categoryId: t.arg.id({ required: true }),
      aiPrompt: t.arg.string(),
      restrictions: t.arg.stringList(),
      sortOrder: t.arg.int(),
    },
    resolve: (_r, args, ctx) =>
      ctx.services.tag.createTag({
        name: args.name,
        description: args.description ?? null,
        categoryId: args.categoryId,
        aiPrompt: args.aiPrompt ?? null,
        restrictions: args.restrictions ?? null,
        sortOrder: args.sortOrder ?? null,
      }),
  }),

  // Update tag
  updateTag: t.field({
    type: TagRef,
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string(),
      description: t.arg.string(),
      aiPrompt: t.arg.string(),
      restrictions: t.arg.stringList(),
      sortOrder: t.arg.int(),
    },
    resolve: (_r, args, ctx) => {
      const data: any = {};
      if (args.name !== undefined) data.name = args.name;
      if (args.description !== undefined) data.description = args.description;
      if (args.aiPrompt !== undefined) data.aiPrompt = args.aiPrompt;
      if (args.restrictions !== undefined)
        data.restrictions = args.restrictions;
      if (args.sortOrder !== undefined) data.sortOrder = args.sortOrder;
      return ctx.services.tag.updateTag(args.id, data);
    },
  }),

  // Delete tag
  deleteTag: t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_r, { id }, ctx) => ctx.services.tag.deleteTag(id),
  }),

  // Create tag conflict
  createTagConflict: t.field({
    type: TagConflictRef,
    args: {
      tagId1: t.arg.id({ required: true }),
      tagId2: t.arg.id({ required: true }),
      conflictType: t.arg.string({ required: true }),
      description: t.arg.string(),
    },
    resolve: (_r, args, ctx) =>
      ctx.services.tag.createTagConflict({
        tagId1: args.tagId1,
        tagId2: args.tagId2,
        conflictType: args.conflictType,
        description: args.description,
      }),
  }),

  // Delete tag conflict
  deleteTagConflict: t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_r, { id }, ctx) => ctx.services.tag.deleteTagConflict(id),
  }),
}));
