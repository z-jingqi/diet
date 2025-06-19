import { z } from "zod";

export const NutritionSchema = z.object({
  protein: z.number().describe('蛋白质含量（克）'),
  potassium: z.number().describe('钾含量（毫克）'),
  phosphorus: z.number().describe('磷含量（毫克）'),
  sodium: z.number().describe('钠含量（毫克）'),
  calories: z.number().describe('卡路里（千卡）')
}).describe('营养成分信息');

export type Nutrition = z.infer<typeof NutritionSchema>; 
