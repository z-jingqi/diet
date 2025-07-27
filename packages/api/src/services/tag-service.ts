import { DB } from "../db";
import { tag_categories, tags, tag_conflicts } from "../db/schema/tags";
import { eq, and, like, asc, inArray } from "drizzle-orm";

export class TagService {
  constructor(private db: DB) {}

  // Category operations
  async listCategories() {
    return this.db
      .select()
      .from(tag_categories)
      .where(eq(tag_categories.is_active, true))
      .orderBy(asc(tag_categories.sort_order), asc(tag_categories.name));
  }

  async getCategory(id: string) {
    const [cat] = await this.db
      .select()
      .from(tag_categories)
      .where(eq(tag_categories.id, id))
      .limit(1);
    return cat ?? null;
  }

  async createCategory(data: {
    name: string;
    description?: string | null;
    sortOrder?: number;
  }) {
    const { generateId } = await import("../utils/id");
    const id = generateId();
    const [cat] = await this.db
      .insert(tag_categories)
      .values({
        id,
        name: data.name,
        description: data.description || null,
        sort_order: data.sortOrder ?? 0,
      })
      .returning();
    return cat;
  }

  async updateCategory(
    id: string,
    data: Partial<{
      name: string;
      description: string | null;
      sortOrder: number;
    }>,
  ) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;

    const [cat] = await this.db
      .update(tag_categories)
      .set(updateData)
      .where(eq(tag_categories.id, id))
      .returning();
    return cat ?? null;
  }

  async deleteCategory(id: string) {
    await this.db.delete(tag_categories).where(eq(tag_categories.id, id));
    return true;
  }

  // Tag operations
  async listTags(options: { categoryId?: string; search?: string }) {
    const conditions: any[] = [eq(tags.is_active, true)];
    if (options.categoryId)
      conditions.push(eq(tags.category_id, options.categoryId));
    if (options.search) conditions.push(like(tags.name, `%${options.search}%`));

    return this.db
      .select()
      .from(tags)
      .where(and(...conditions))
      .orderBy(asc(tags.sort_order), asc(tags.name));
  }

  async getTag(id: string) {
    const [tag] = await this.db
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1);
    return tag ?? null;
  }

  async getTagsByCategory(categoryId: string) {
    return this.db.select().from(tags).where(eq(tags.category_id, categoryId));
  }

  async createTag(data: {
    name: string;
    description?: string | null;
    categoryId: string;
    aiPrompt?: string | null;
    restrictions?: string[] | null;
    sortOrder?: number | null;
  }) {
    const { generateId } = await import("../utils/id");
    const id = generateId();
    const [tag] = await this.db
      .insert(tags)
      .values({
        id,
        name: data.name,
        description: data.description || null,
        category_id: data.categoryId,
        ai_prompt: data.aiPrompt || null,
        restrictions: data.restrictions
          ? JSON.stringify(data.restrictions)
          : null,
        sort_order: data.sortOrder ?? 0,
      })
      .returning();
    return tag;
  }

  async updateTag(
    id: string,
    data: Partial<{
      name: string;
      description: string | null;
      aiPrompt: string | null;
      restrictions: string[];
      sortOrder: number | null;
    }>,
  ) {
    const upd: any = {};
    if (data.name !== undefined) upd.name = data.name;
    if (data.description !== undefined) upd.description = data.description;
    if (data.aiPrompt !== undefined) upd.ai_prompt = data.aiPrompt;
    if (data.restrictions !== undefined)
      upd.restrictions = JSON.stringify(data.restrictions);
    if (data.sortOrder !== undefined) upd.sort_order = data.sortOrder;

    const [tag] = await this.db
      .update(tags)
      .set(upd)
      .where(eq(tags.id, id))
      .returning();
    return tag ?? null;
  }

  async deleteTag(id: string) {
    await this.db.delete(tags).where(eq(tags.id, id));
    return true;
  }

  // Conflicts
  async listConflicts() {
    return this.db
      .select()
      .from(tag_conflicts)
      .orderBy(asc(tag_conflicts.conflict_type), asc(tag_conflicts.id));
  }

  async checkConflicts(tagIds: string[]) {
    const conflicts = await this.db
      .select()
      .from(tag_conflicts)
      .where(
        and(
          inArray(tag_conflicts.tag_id_1, tagIds),
          inArray(tag_conflicts.tag_id_2, tagIds),
        ),
      );

    const grouped = {
      mutual_exclusive: conflicts.filter(
        (c) => c.conflict_type === "mutual_exclusive",
      ),
      warning: conflicts.filter((c) => c.conflict_type === "warning"),
      info: conflicts.filter((c) => c.conflict_type === "info"),
    };

    return {
      conflicts: grouped,
      hasConflicts: conflicts.length > 0,
      totalConflicts: conflicts.length,
    };
  }

  // --- Tag Conflict CRUD ---

  async createTagConflict(data: {
    tagId1: string;
    tagId2: string;
    conflictType: string;
    description?: string | null;
  }) {
    const { generateId } = await import("../utils/id");
    const id = generateId();
    const [conflict] = await this.db
      .insert(tag_conflicts)
      .values({
        id,
        tag_id_1: data.tagId1,
        tag_id_2: data.tagId2,
        conflict_type: data.conflictType,
        description: data.description || null,
      })
      .returning();
    return conflict;
  }

  async deleteTagConflict(id: string) {
    await this.db.delete(tag_conflicts).where(eq(tag_conflicts.id, id));
    return true;
  }
}
