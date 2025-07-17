import { z } from 'zod';

// ────────────────────────────────────────────────
// Sub-schemas
// ────────────────────────────────────────────────

/**
 * 营养成分对象
 * 存储常见宏量营养素和钠含量，单位均为克（g）或毫克（mg）
 */
export const RecipeNutrientSchema = z.object({
  calories: z
    .number()
    .nonnegative()
    .describe('热量 ‑ kcal'),
  protein: z
    .number()
    .nonnegative()
    .describe('蛋白质 ‑ g'),
  fat: z
    .number()
    .nonnegative()
    .describe('脂肪 ‑ g'),
  carbs: z
    .number()
    .nonnegative()
    .describe('碳水化合物 ‑ g'),
  fiber: z
    .number()
    .nonnegative()
    .describe('膳食纤维 ‑ g'),
  sodium: z
    .number()
    .nonnegative()
    .describe('钠 ‑ mg'),
  sugar: z
    .number()
    .nonnegative()
    .describe('糖 ‑ g'),
});

/**
 * 单条食材信息
 */
export const RecipeIngredientSchema = z.object({
  order: z.number().int().nonnegative().describe('显示顺序（从 0 开始）'),
  // ingredientId 字段移除，系统暂无统一食材表
  name: z.string().describe('食材名称'),
  quantity: z.number().positive().describe('数量'),
  unit: z.string().describe('单位，如 g、ml、个'),
  isOptional: z.boolean().default(false).describe('是否可省略'),
  substitutes: z
    .array(z.string())
    .optional()
    .describe('可替代食材名称列表'),
  note: z.string().optional().describe('额外说明，如“切丁”'),
  costApprox: z
    .number()
    .nonnegative()
    .optional()
    .describe('预估花费（与该食材用量对应，单位与菜谱 currency 一致）'),
});

/**
 * 单条步骤信息
 */
export const RecipeStepSchema = z.object({
  order: z.number().int().nonnegative().describe('步骤顺序（从 0 开始）'),
  instruction: z.string().describe('步骤文字说明'),
  durationApproxMin: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('预估耗时（分钟，可选）'),
  imageUrl: z
    .string()
    .url()
    .optional()
    .describe('步骤配图 URL（预留）'),
});

/**
 * 需要特殊厨具时的记录
 */
export const RecipeEquipmentSchema = z.object({
  name: z.string().describe('厨具名称'),
  note: z.string().optional().describe('使用提示 / 规格说明（可选）'),
});

// ────────────────────────────────────────────────
// 主 Recipe Schema
// ────────────────────────────────────────────────

/**
 * 完整菜谱对象
 * 时间和成本均为 AI 估算值，字段名以 "Approx" 标识
 */
export const RecipeSchema = z.object({
  id: z.string().uuid().describe('菜谱唯一标识'),
  name: z.string().min(1).describe('菜名'),
  description: z.string().describe('味型 / 卖点简介'),
  coverImageUrl: z
    .string()
    .url()
    .optional()
    .describe('主图 URL（预留）'),
  cuisineType: z.string().describe('菜系，如 "川菜"'),
  mealType: z.string().describe('餐次 / 场景'),
  servings: z.number().int().positive().describe('适用人数'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('难度等级'),
  prepTimeApproxMin: z
    .number()
    .int()
    .nonnegative()
    .describe('备料时间（估算，分钟）'),
  cookTimeApproxMin: z
    .number()
    .int()
    .nonnegative()
    .describe('烹饪时间（估算，分钟）'),
  totalTimeApproxMin: z
    .number()
    .int()
    .nonnegative()
    .describe('总耗时（估算，分钟）'),
  costApprox: z
    .number()
    .nonnegative()
    .describe('参考花费（单份，估算）'),
  currency: z
    .string()
    .length(3)
    .describe('货币代码，ISO 4217，例如 CNY'),
  dietaryTags: z.array(z.string()).describe('饮食/健康标签列表'),
  allergens: z.array(z.string()).describe('过敏原列表'),
  tips: z.string().optional().describe('关键小贴士'),
  leftoverHandling: z
    .string()
    .optional()
    .describe('剩菜处理建议'),
  version: z.number().int().min(1).default(1).describe('修订版本号'),
  checksum: z.string().describe('内容哈希，便于去重/审计'),
  createdAt: z
    .string()
    .describe('创建时间，ISO 字符串'),
  updatedAt: z
    .string()
    .describe('最近更新时间，ISO 字符串'),

  // 与聊天消息关联
  sourceMessageId: z
    .string()
    .describe('生成该菜谱所依据的聊天消息 ID'),

  // 关联字段
  ingredients: z
    .array(RecipeIngredientSchema)
    .min(1)
    .describe('食材列表'),
  steps: z.array(RecipeStepSchema).min(1).describe('步骤列表'),
  nutrients: RecipeNutrientSchema.describe('营养成分信息'),
  equipments: z
    .array(RecipeEquipmentSchema)
    .optional()
    .describe('所需厨具列表（可选）'),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export default RecipeSchema;
