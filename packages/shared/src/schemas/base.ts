import { z } from "zod";

export const NutritionSchema = z.object({
  totalProtein: z.number().describe('总蛋白质含量（克）'),
  totalPotassium: z.number().describe('总钾含量（毫克）'),
  totalPhosphorus: z.number().describe('总磷含量（毫克）'),
  totalSodium: z.number().describe('总钠含量（毫克）'),
  totalCalories: z.number().describe('总卡路里（千卡）')
}).describe('营养成分信息');

export type Nutrition = z.infer<typeof NutritionSchema>; 
