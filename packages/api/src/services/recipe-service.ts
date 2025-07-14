import { DB } from "../db";
import { recipes, recipePreferences } from "../db/schema";
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

export interface RecipePreferenceInput {
  recipeId?: string;
  recipeName: string;
  recipeBasicInfo?: string;
  preference: "LIKE" | "DISLIKE";
}

export interface RecipeGenerateInput {
  recipeName: string;
  recipeBasicInfo: string;
  servings: number;
  description?: string;
  cuisineType?: string;
  mealType?: string;
  dietaryTags?: string[];
  allergens?: string[];
}

type RecipeModel = typeof recipes.$inferSelect;
type RecipePreferenceModel = typeof recipePreferences.$inferSelect;

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

  async getRecipePreferences(userId: string): Promise<RecipePreferenceModel[]> {
    return this.db
      .select()
      .from(recipePreferences)
      .where(eq(recipePreferences.user_id, userId));
  }

  async setRecipePreference(
    userId: string,
    data: RecipePreferenceInput
  ): Promise<RecipePreferenceModel> {
    const { generateId } = await import("../utils/id");
    const now = new Date().toISOString();
    
    // 检查是否已经存在相同菜谱的喜好记录
    const [existing] = await this.db
      .select()
      .from(recipePreferences)
      .where(
        and(
          eq(recipePreferences.user_id, userId),
          eq(recipePreferences.recipe_name, data.recipeName)
        )
      )
      .limit(1);

    // 如果已存在，则更新
    if (existing) {
      const [updated] = await this.db
        .update(recipePreferences)
        .set({
          preference: data.preference,
          recipe_id: data.recipeId,
          recipe_basic_info: data.recipeBasicInfo,
          updated_at: now,
        })
        .where(eq(recipePreferences.id, existing.id))
        .returning();
      
      return updated;
    }
    
    // 否则创建新记录
    const id = generateId();
    const [created] = await this.db
      .insert(recipePreferences)
      .values({
        id,
        user_id: userId,
        recipe_id: data.recipeId,
        recipe_name: data.recipeName,
        recipe_basic_info: data.recipeBasicInfo,
        preference: data.preference,
        created_at: now,
        updated_at: now,
      })
      .returning();
    
    return created;
  }

  // 添加生成菜谱方法
  async generateRecipe(
    userId: string,
    data: RecipeGenerateInput
  ): Promise<RecipeModel> {
    try {
      const { generateId } = await import("../utils/id");
      const id = generateId();
      const now = new Date().toISOString();
      
      // 解析基础菜谱信息
      const basicInfo = JSON.parse(data.recipeBasicInfo);
      const difficulty = this.mapDifficulty(basicInfo.difficulty || "中等");
      
      // 构造默认值
      const cookTimeMin = this.estimateCookTime(basicInfo);
      const costApprox = this.estimateCost(basicInfo.avgCost);
      
      // TODO: 调用AI服务生成详细菜谱内容
      // 这里是模拟生成的菜谱数据
      const ingredients = JSON.stringify([
        { name: "主要食材1", amount: "200g", notes: "切块" },
        { name: "主要食材2", amount: "100g", notes: "切丝" },
        { name: "调料1", amount: "10g", notes: "" }
      ]);
      
      const steps = JSON.stringify([
        { step: 1, description: "准备所有食材", imageUrl: null, tips: "确保食材新鲜" },
        { step: 2, description: "热锅下油", imageUrl: null, tips: "油温4成热" },
        { step: 3, description: "放入食材翻炒", imageUrl: null, tips: "中火翻炒均匀" }
      ]);
      
      const nutrients = JSON.stringify({
        calories: 300,
        protein: "15g",
        carbs: "30g",
        fat: "10g",
        fiber: "5g"
      });
      
      const values: any = {
        id,
        user_id: userId,
        name: data.recipeName,
        description: data.description || `这是一道美味的${data.recipeName}`,
        servings: data.servings,
        difficulty,
        prep_time_approx_min: Math.floor(cookTimeMin * 0.3),
        cook_time_approx_min: cookTimeMin,
        total_time_approx_min: Math.floor(cookTimeMin * 1.5),
        cost_approx: costApprox,
        currency: "CNY",
        version: 1,
        checksum: id,
        ingredients,
        steps,
        nutrients,
        created_at: now,
        updated_at: now,
      };
      
      if (data.cuisineType) values.cuisine_type = data.cuisineType;
      if (data.mealType) values.meal_type = data.mealType;
      if (data.dietaryTags) values.dietary_tags = JSON.stringify(data.dietaryTags);
      if (data.allergens) values.allergens = JSON.stringify(data.allergens);
      
      // 创建菜谱记录
      const [recipe] = await this.db.insert(recipes).values(values).returning();
      
      // 同时标记该菜谱为喜欢
      await this.setRecipePreference(userId, {
        recipeId: id,
        recipeName: data.recipeName,
        preference: "LIKE"
      });
      
      return recipe;
    } catch (error) {
      console.error("生成菜谱失败:", error);
      throw new Error("生成菜谱失败");
    }
  }
  
  // 辅助方法：将中文难度映射到枚举值
  private mapDifficulty(difficultyText: string): string {
    const map: Record<string, string> = {
      "简单": "EASY",
      "容易": "EASY",
      "中等": "MEDIUM",
      "适中": "MEDIUM",
      "困难": "HARD",
      "复杂": "HARD"
    };
    
    return map[difficultyText] || "MEDIUM";
  }
  
  // 辅助方法：估算烹饪时间（分钟）
  private estimateCookTime(basicInfo: any): number {
    if (!basicInfo.duration) return 30;
    
    const durationText = basicInfo.duration;
    const minutesMatch = durationText.match(/(\d+)分钟/);
    const hoursMatch = durationText.match(/(\d+)小时/);
    
    let minutes = 0;
    if (minutesMatch) minutes += parseInt(minutesMatch[1]);
    if (hoursMatch) minutes += parseInt(hoursMatch[1]) * 60;
    
    return minutes || 30; // 默认30分钟
  }
  
  // 辅助方法：估算成本（元）
  private estimateCost(costText: string): number {
    if (!costText) return 25;
    
    const rangeMatch = costText.match(/(\d+)-(\d+)元/);
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1]);
      const max = parseInt(rangeMatch[2]);
      return Math.floor((min + max) / 2);
    }
    
    const singleMatch = costText.match(/(\d+)元/);
    if (singleMatch) {
      return parseInt(singleMatch[1]);
    }
    
    return 25; // 默认25元
  }
} 
