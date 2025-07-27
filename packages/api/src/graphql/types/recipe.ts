import { builder, DateTimeScalar } from "../builder";
import { recipes, recipePreferences } from "../../db/schema";
import { InferSelectModel } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

// Drizzle model type
type RecipeModel = InferSelectModel<typeof recipes>;
type RecipePreferenceModel = InferSelectModel<typeof recipePreferences>;

// ----------------------
// Recipe type
// ----------------------
export const RecipeRef = builder.objectRef<RecipeModel>("Recipe").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    coverImageUrl: t.exposeString("cover_image_url", { nullable: true }),
    cuisineType: t.field({
      type: CuisineTypeEnum,
      nullable: true,
      resolve: (p) => p.cuisine_type as any,
    }),
    mealType: t.field({
      type: MealTypeEnum,
      nullable: true,
      resolve: (p) => p.meal_type as any,
    }),
    servings: t.exposeInt("servings"),
    difficulty: t.field({
      type: DifficultyEnum,
      nullable: true,
      resolve: (p) => p.difficulty as any,
    }),
    prepTimeApproxMin: t.exposeInt("prep_time_approx_min", { nullable: true }),
    cookTimeApproxMin: t.exposeInt("cook_time_approx_min", { nullable: true }),
    totalTimeApproxMin: t.exposeInt("total_time_approx_min", { nullable: true }),
    costApprox: t.exposeInt("cost_approx", { nullable: true }),
    currency: t.exposeString("currency", { nullable: true }),
    tips: t.exposeString("tips", { nullable: true }),
    leftoverHandling: t.exposeString("leftover_handling", { nullable: true }),
    version: t.exposeInt("version"),
    checksum: t.exposeString("checksum"),
    createdAt: t.expose("created_at", { type: DateTimeScalar, nullable: true }),
    updatedAt: t.expose("updated_at", { type: DateTimeScalar, nullable: true }),

    // JSON parsed fields
    dietaryTags: t.field({
      type: ["String"],
      nullable: true,
      resolve: (parent) => {
        if (!parent.dietary_tags) return null;
        try {
          return JSON.parse(parent.dietary_tags);
        } catch {
          return null;
        }
      },
    }),
    allergens: t.field({
      type: ["String"],
      nullable: true,
      resolve: (parent) => {
        if (!parent.allergens) return null;
        try {
          return JSON.parse(parent.allergens);
        } catch {
          return null;
        }
      },
    }),
    ingredientsJson: t.exposeString("ingredients"),
    stepsJson: t.exposeString("steps"),
    nutrientsJson: t.exposeString("nutrients", { nullable: true }),
    equipmentsJson: t.exposeString("equipments", { nullable: true }),
  }),
});

// ----------------------
// Recipe Preference type
// ----------------------
export const PreferenceEnum = builder.enumType("PreferenceType", {
  values: {
    LIKE: { description: "用户喜欢" },
    DISLIKE: { description: "用户不喜欢" },
  },
});

export const RecipePreferenceRef = builder.objectRef<RecipePreferenceModel>("RecipePreference").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    recipeId: t.exposeString("recipe_id", { nullable: true }),
    recipeName: t.exposeString("recipe_name"),
    preference: t.field({
      type: PreferenceEnum,
      resolve: (parent) => parent.preference as any,
    }),
    recipeBasicInfo: t.exposeString("recipe_basic_info", { nullable: true }),
    createdAt: t.expose("created_at", { type: DateTimeScalar, nullable: true }),
  }),
});

// ----------------------
// Input type
// ----------------------
const RecipeInput = builder.inputType("RecipeInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string(),
    coverImageUrl: t.string(),
    cuisineType: t.field({ type: CuisineTypeEnum }),
    mealType: t.field({ type: MealTypeEnum }),
    servings: t.int({ required: true }),
    difficulty: t.field({ type: DifficultyEnum }),
    prepTimeApproxMin: t.int(),
    cookTimeApproxMin: t.int(),
    totalTimeApproxMin: t.int(),
    costApprox: t.int(),
    currency: t.string(),
    dietaryTags: t.stringList(),
    allergens: t.stringList(),
    tips: t.string(),
    leftoverHandling: t.string(),
    ingredientsJson: t.string({ required: true }),
    stepsJson: t.string({ required: true }),
    nutrientsJson: t.string(),
    equipmentsJson: t.string(),
  }),
});

const RecipePreferenceInput = builder.inputType("RecipePreferenceInput", {
  fields: (t) => ({
    recipeId: t.string({ required: false }),
    recipeName: t.string({ required: true }),
    recipeBasicInfo: t.string({ required: false }),
    preference: t.field({ type: PreferenceEnum, required: true }),
  }),
});

// 新增：菜谱生成输入类型
const RecipeGenerateInput = builder.inputType("RecipeGenerateInput", {
  fields: (t) => ({
    recipeName: t.string({ required: true }),
    recipeBasicInfo: t.string({ required: true }),
    servings: t.int({ required: true, defaultValue: 2 }),
    description: t.string(),
    cuisineType: t.field({ type: CuisineTypeEnum }),
    mealType: t.field({ type: MealTypeEnum }),
    dietaryTags: t.stringList(),
    allergens: t.stringList(),
  }),
});

// ----------------------
// Queries
// ----------------------
builder.queryFields((t) => ({
  myRecipes: t.field({
    type: [RecipeRef],
    resolve: (_r, _a, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.listMyRecipes(auth.user.id);
    },
  }),

  recipesByIds: t.field({
    type: [RecipeRef],
    args: { ids: t.arg.idList({ required: true }) },
    resolve: (_r, { ids }, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.getRecipesByIds(
        ids as string[],
        auth.user.id
      );
    },
  }),

  recipe: t.field({
    type: RecipeRef,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_r, { id }, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.getRecipe(id, auth.user.id);
    },
  }),

  // 添加查询用户菜谱喜好
  myRecipePreferences: t.field({
    type: [RecipePreferenceRef],
    resolve: (_r, _a, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.getRecipePreferences(auth.user.id);
    },
  }),
}));

// ----------------------
// Mutations
// ----------------------
builder.mutationFields((t) => ({
  createRecipe: t.field({
    type: RecipeRef,
    args: { input: t.arg({ type: RecipeInput, required: true }) },
    resolve: (_r, { input }, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.createRecipe(auth.user.id, input as any);
    },
  }),

  updateRecipe: t.field({
    type: RecipeRef,
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: RecipeInput, required: true }),
    },
    resolve: (_r, { id, input }, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.updateRecipe(id, auth.user.id, input as any);
    },
  }),

  deleteRecipe: t.field({
    type: "Boolean",
    args: { id: t.arg.id({ required: true }) },
    resolve: (_r, { id }, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.deleteRecipe(id, auth.user.id);
    },
  }),

  deleteRecipes: t.field({
    type: "Boolean",
    args: { ids: t.arg.idList({ required: true }) },
    resolve: (_r, { ids }, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.deleteRecipes(ids as string[], auth.user.id);
    },
  }),

  // 添加设置菜谱喜好的变更操作
  setRecipePreference: t.field({
    type: RecipePreferenceRef,
    args: {
      input: t.arg({ type: RecipePreferenceInput, required: true }),
    },
    resolve: (_r, { input }, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.setRecipePreference(auth.user.id, {
        ...input,
        recipeId: input.recipeId ?? undefined,
        recipeBasicInfo: input.recipeBasicInfo ?? undefined,
      });
    },
  }),

  // 添加删除菜谱喜好的变更操作
  removeRecipePreference: t.field({
    type: "Boolean",
    args: {
      recipeId: t.arg.id({ required: true }),
    },
    resolve: (_r, { recipeId }, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.recipe.removeRecipePreference(auth.user.id, recipeId as string);
    },
  }),

  // 添加生成菜谱变更操作
  generateRecipe: t.field({
    type: RecipeRef,
    args: {
      input: t.arg({ type: RecipeGenerateInput, required: true }),
    },
    resolve: async (_r, { input }, ctx) => {
      const auth = requireAuth(ctx);
      // 使用AI助手生成菜谱，然后保存到数据库
      return ctx.services.recipe.generateRecipe(auth.user.id, {
        ...input,
        description: input.description ?? undefined,
        cuisineType: input.cuisineType ?? undefined,
        mealType: input.mealType ?? undefined,
        dietaryTags: input.dietaryTags ?? undefined,
        allergens: input.allergens ?? undefined,
      });
    },
  }),
}));

// ----------------------
// Enums
// ----------------------

export const DifficultyEnum = builder.enumType("Difficulty", {
  values: {
    EASY: {},
    MEDIUM: {},
    HARD: {},
  },
});

export const MealTypeEnum = builder.enumType("MealType", {
  description: "用餐场景 / 餐次类型",
  values: {
    BREAKFAST: { description: "早餐" },
    LUNCH: { description: "午餐" },
    DINNER: { description: "晚餐" },
    SNACK: { description: "加餐 / 零食" },
    DESSERT: { description: "甜点" },
    DRINK: { description: "饮品" },
    OTHER: { description: "其他场景" },
  },
});

export const CuisineTypeEnum = builder.enumType("CuisineType", {
  description: "菜系类型，用于区分不同风味的食谱",
  values: {
    CHINESE: { description: "中餐 / 中国菜" },
    JAPANESE: { description: "日餐 / 日本菜" },
    KOREAN: { description: "韩餐 / 韩国菜" },
    ITALIAN: { description: "意大利菜" },
    FRENCH: { description: "法餐" },
    MEXICAN: { description: "墨西哥菜" },
    INDIAN: { description: "印度菜" },
    THAI: { description: "泰国菜" },
    WESTERN: { description: "西餐（泛指欧美等西方菜系）" },
    OTHER: { description: "其他或未分类" },
  },
}); 
