import { DB } from "../db";
import { recipes } from "../db/schema";
import { eq, and, isNull } from "drizzle-orm";

export interface RecipeCreateInput {
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  cuisineType?: string | null;
  mealType?: string | null;
  servings: number;
  difficulty?: string | null;
  prepTimeApproxMin?: number | null;
  cookTimeApproxMin?: number | null;
  totalTimeApproxMin?: number | null;
  costApprox?: number | null;
  currency?: string | null;
  dietaryTags?: string[] | null;
  allergens?: string[] | null;
  tips?: string | null;
  leftoverHandling?: string | null;
  ingredientsJson: string; // JSON stringified array
  stepsJson: string; // JSON stringified array
  nutrientsJson?: string | null; // JSON object string
  equipmentsJson?: string | null; // JSON stringified array
}

export type RecipeUpdateInput = Partial<RecipeCreateInput>;

type RecipeModel = typeof recipes.$inferSelect;

export class RecipeService {
  constructor(private db: DB) {}

  async listMyRecipes(userId: string): Promise<RecipeModel[]> {
    return this.db
      .select()
      .from(recipes)
      .where(and(eq(recipes.user_id, userId), isNull(recipes.deleted_at)));
  }

  async getRecipe(id: string, userId: string): Promise<RecipeModel | null> {
    const [rec] = await this.db
      .select()
      .from(recipes)
      .where(
        and(eq(recipes.id, id), eq(recipes.user_id, userId), isNull(recipes.deleted_at))
      )
      .limit(1);
    return rec ?? null;
  }

  async createRecipe(
    userId: string,
    data: RecipeCreateInput
  ): Promise<RecipeModel> {
    const { generateId } = await import("../utils/id");
    const id = generateId();
    const now = new Date().toISOString();

    const values: any = {
      id,
      user_id: userId,
      name: data.name,
      servings: data.servings,
      version: 1,
      checksum: id,
      ingredients: data.ingredientsJson,
      steps: data.stepsJson,
      created_at: now,
      updated_at: now,
    };

    if (data.description !== undefined) values.description = data.description;
    if (data.coverImageUrl !== undefined)
      values.cover_image_url = data.coverImageUrl;
    if (data.cuisineType !== undefined) values.cuisine_type = data.cuisineType;
    if (data.mealType !== undefined) values.meal_type = data.mealType;
    if (data.difficulty !== undefined) values.difficulty = data.difficulty;
    if (data.prepTimeApproxMin !== undefined)
      values.prep_time_approx_min = data.prepTimeApproxMin;
    if (data.cookTimeApproxMin !== undefined)
      values.cook_time_approx_min = data.cookTimeApproxMin;
    if (data.totalTimeApproxMin !== undefined)
      values.total_time_approx_min = data.totalTimeApproxMin;
    if (data.costApprox !== undefined) values.cost_approx = data.costApprox;
    if (data.currency !== undefined) values.currency = data.currency;
    if (data.dietaryTags !== undefined)
      values.dietary_tags = JSON.stringify(data.dietaryTags);
    if (data.allergens !== undefined)
      values.allergens = JSON.stringify(data.allergens);
    if (data.tips !== undefined) values.tips = data.tips;
    if (data.leftoverHandling !== undefined)
      values.leftover_handling = data.leftoverHandling;
    if (data.nutrientsJson !== undefined) values.nutrients = data.nutrientsJson;
    if (data.equipmentsJson !== undefined)
      values.equipments = data.equipmentsJson;

    const [rec] = await this.db.insert(recipes).values(values).returning();

    return rec;
  }

  async updateRecipe(
    id: string,
    userId: string,
    data: RecipeUpdateInput
  ): Promise<RecipeModel | null> {
    const update: any = {};

    if (data.name !== undefined) update.name = data.name;
    if (data.description !== undefined) update.description = data.description;
    if (data.coverImageUrl !== undefined)
      update.cover_image_url = data.coverImageUrl;
    if (data.cuisineType !== undefined) update.cuisine_type = data.cuisineType;
    if (data.mealType !== undefined) update.meal_type = data.mealType;
    if (data.servings !== undefined) update.servings = data.servings;
    if (data.difficulty !== undefined) update.difficulty = data.difficulty;
    if (data.prepTimeApproxMin !== undefined)
      update.prep_time_approx_min = data.prepTimeApproxMin;
    if (data.cookTimeApproxMin !== undefined)
      update.cook_time_approx_min = data.cookTimeApproxMin;
    if (data.totalTimeApproxMin !== undefined)
      update.total_time_approx_min = data.totalTimeApproxMin;
    if (data.costApprox !== undefined) update.cost_approx = data.costApprox;
    if (data.currency !== undefined) update.currency = data.currency;
    if (data.dietaryTags !== undefined)
      update.dietary_tags = JSON.stringify(data.dietaryTags ?? []);
    if (data.allergens !== undefined)
      update.allergens = JSON.stringify(data.allergens ?? []);
    if (data.tips !== undefined) update.tips = data.tips;
    if (data.leftoverHandling !== undefined)
      update.leftover_handling = data.leftoverHandling;
    if (data.ingredientsJson !== undefined)
      update.ingredients = data.ingredientsJson;
    if (data.stepsJson !== undefined) update.steps = data.stepsJson;
    if (data.nutrientsJson !== undefined) update.nutrients = data.nutrientsJson;
    if (data.equipmentsJson !== undefined)
      update.equipments = data.equipmentsJson;

    update.updated_at = new Date().toISOString();

    const [rec] = await this.db
      .update(recipes)
      .set(update)
      .where(and(eq(recipes.id, id), eq(recipes.user_id, userId)))
      .returning();
    return rec ?? null;
  }

  async deleteRecipe(id: string, userId: string): Promise<boolean> {
    const [rec] = await this.db
      .update(recipes)
      .set({ deleted_at: new Date().toISOString() })
      .where(and(eq(recipes.id, id), eq(recipes.user_id, userId)))
      .returning();
    return rec !== undefined;
  }
} 
