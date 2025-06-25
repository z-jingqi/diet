import { builder } from '../builder';
import { tagCategories, tags } from '../../db/schema/tags';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

// Drizzle model types
type TagCategoryModel = InferSelectModel<typeof tagCategories>;
type TagModel = InferSelectModel<typeof tags>;

// ----------------------
// TagCategory type
// ----------------------
export const TagCategoryRef = builder.objectRef<TagCategoryModel>('TagCategory').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    sortOrder: t.exposeInt('sortOrder', { nullable: true }),
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
    aiPrompt: t.exposeString('aiPrompt'),
    sortOrder: t.exposeInt('sortOrder', { nullable: true }),
    isActive: t.exposeBoolean('isActive', { nullable: true }),
    category: t.field({
      type: TagCategoryRef,
      resolve: async (parent, _args, ctx) => {
        const [category] = await ctx.context.db
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
// Queries
// ----------------------
builder.queryFields((t) => ({
  // Fetch all active tags
  tags: t.field({
    type: [TagRef],
    resolve: async (_root, _args, ctx) => {
      return await ctx.context.db.select().from(tags).where(eq(tags.isActive, true));
    },
  }),

  // Fetch single tag by ID
  tag: t.field({
    type: TagRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [tag] = await ctx.context.db
        .select()
        .from(tags)
        .where(eq(tags.id, id as string))
        .limit(1);
      return tag ?? null;
    },
  }),
})); 
