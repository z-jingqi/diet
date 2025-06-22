import { z } from "zod";
import { NutritionSchema } from "./base";

export const RecipeIngredientSchema = z.object({
  name: z.string().describe('食材名称'),
  amount: z.number().describe('用量，例如：100'),
  unit: z.string().describe('用量单位，例如："g"、"个"'),
  price: z.string().describe('食材价格范围（元），例如："5-8"'),
  nutrition: NutritionSchema.describe('该食材的营养成分'),
  purpose: z.string().optional().describe('食材的用途说明')
}).describe('菜谱中的单个食材');

export const RecipeStepSchema = z.object({
  description: z.string().describe('步骤描述'),
  time: z.number().describe('预估时间（分钟）'),
  tips: z.string().optional().describe('烹饪技巧提示')
}).describe('菜谱中的单个步骤');

export const RecipeCostSchema = z.string().describe('总成本范围（元），例如："20-35"');

export const KitchenToolSchema = z.object({
  name: z.string().describe('厨具名称'),
  description: z.string().optional().describe('厨具用途说明'),
  required: z.boolean().describe('是否必需，true为必需，false为可选')
}).describe('菜谱需要的厨具');

export const RecipeSchema = z.object({
  name: z.string().describe('菜谱名称'),
  description: z.string().describe('菜谱的简要描述，使用markdown格式，包括菜品特点、口感、适合人群等信息。可以使用**加粗**、*斜体*等markdown语法来强调重要信息'),
  ingredients: z.array(RecipeIngredientSchema).describe('所需食材列表'),
  steps: z.array(RecipeStepSchema).describe('烹饪步骤列表'),
  kitchenTools: z.array(KitchenToolSchema).describe('需要的厨具列表'),
  nutrition: NutritionSchema.describe('菜谱的营养成分信息'),
  cost: RecipeCostSchema.describe('菜谱成本信息'),
  leftoverTips: z.string().optional().describe('剩菜处理建议'),
  dietNote: z.string().optional().describe('饮食注意事项'),
  tags: z.array(z.string()).optional().describe('菜谱标签，例如：["低钠", "低脂", "家常菜"]'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('烹饪难度'),
  cookingTime: z.number().describe('总烹饪时间，例如：30'),
  servings: z.number().describe('可供食用的人数')
}).describe('菜谱信息');

// 生成的菜谱类型，包含本地唯一ID
export interface GeneratedRecipe extends Recipe {
  id: string;
}

export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;
export type RecipeStep = z.infer<typeof RecipeStepSchema>;
export type RecipeCost = z.infer<typeof RecipeCostSchema>;
export type KitchenTool = z.infer<typeof KitchenToolSchema>; 
