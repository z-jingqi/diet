export * from './base';
export * from './recipe';
export * from './health-advice';
export * from './intent';
export * from './tags';

// 为了兼容性，保留 CLOUDFLARE_SCHEMAS 对象
import { RecipeSchema } from './recipe';
import { HealthAdviceSchema } from './health-advice';
import { IntentSchema } from './intent';

export const CLOUDFLARE_SCHEMAS = {
  recipe: RecipeSchema,
  healthAdvice: HealthAdviceSchema,
  intent: IntentSchema
} as const; 
