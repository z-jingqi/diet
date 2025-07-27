import { z } from "zod";

export const HealthAdviceSchema = z
  .object({
    type: z
      .enum([
        "diet",
        "exercise",
        "lifestyle",
        "mental",
        "environment",
        "social",
        "seasonal",
        "other",
      ])
      .describe("建议类型"),
    status: z
      .enum(["recommended", "moderate", "not_recommended", "forbidden"])
      .describe("建议状态"),
    title: z.string().describe("建议标题"),
    timestamp: z.string().describe("生成时间戳"),
    reasons: z
      .array(
        z.object({
          title: z.string().describe("原因标题"),
          description: z.string().describe("原因详细说明"),
        }),
      )
      .describe("建议原因列表"),
    suggestions: z
      .array(
        z.object({
          title: z.string().describe("建议标题"),
          description: z.string().describe("建议详细说明"),
          priority: z.number().min(1).max(5).describe("优先级（1-5）"),
        }),
      )
      .describe("具体建议列表"),
    scenarios: z
      .array(
        z.object({
          condition: z.string().describe("适用场景描述"),
          impact: z.string().describe("影响说明"),
        }),
      )
      .describe("适用场景列表"),
  })
  .describe("健康建议响应");

export type HealthAdvice = z.infer<typeof HealthAdviceSchema>;
