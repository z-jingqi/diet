import { z } from "zod";

export const IntentSchema = z
  .object({
    intent: z
      .enum(["chat", "recipe", "health_advice"])
      .describe("用户意图类型"),
    confidence: z.number().min(0).max(1).describe("意图识别的置信度"),
  })
  .describe("意图识别结果");

export type Intent = z.infer<typeof IntentSchema>;
