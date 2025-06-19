import { z } from "zod";
import { NutritionSchema } from "./base";

export const RecipeIngredientSchema = z.object({
  name: z.string().describe('食材名称'),
  amount: z.number().describe('用量，例如：100'),
  unit: z.string().describe('用量单位，例如："g"、"个"'),
  nutrition: NutritionSchema.describe('该食材的营养成分'),
  purpose: z.string().optional().describe('食材的用途说明')
}).describe('菜谱中的单个食材');

export const RecipeStepSchema = z.object({
  description: z.string().describe('步骤描述'),
  time: z.number().describe('预估时间（分钟）'),
  tips: z.string().optional().describe('烹饪技巧提示')
}).describe('菜谱中的单个步骤');

export const RecipeSchema = z.object({
  name: z.string().describe('菜谱名称'),
  description: z.string().describe('菜谱的简要描述，使用markdown格式，包括菜品特点、口感、适合人群等信息。可以使用**加粗**、*斜体*等markdown语法来强调重要信息'),
  ingredients: z.array(RecipeIngredientSchema).describe('所需食材列表'),
  steps: z.array(RecipeStepSchema).describe('烹饪步骤列表'),
  nutrition: NutritionSchema.describe('菜谱的营养成分信息'),
  dietNote: z.string().optional().describe('饮食注意事项'),
  tags: z.array(z.string()).optional().describe('菜谱标签，例如：["低钠", "低脂", "家常菜"]'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('烹饪难度'),
  cookingTime: z.number().describe('总烹饪时间，例如：30'),
  servings: z.number().describe('可供食用的人数')
}).describe('菜谱信息');

export const RecipeRecommendationSchema = z.object({
  description: z.string().describe('菜谱推荐的总体描述，包括推荐理由、适合人群等'),
  recipes: z.array(RecipeSchema).describe('推荐的菜谱列表')
}).describe('菜谱推荐响应');

export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;
export type RecipeStep = z.infer<typeof RecipeStepSchema>;
export type RecipeRecommendation = z.infer<typeof RecipeRecommendationSchema>; 
