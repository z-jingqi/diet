import { Message, AIConfig, ResponseFormat, DEFAULT_MODELS } from "./types";
import { INTENT_PROMPT } from "./prompts/intent-prompt";
import { CHAT_PROMPT } from "./prompts/chat-prompt";
import { RECIPE_PROMPT } from "./prompts/recipe-prompt";
import { HEALTH_ADVICE_PROMPT } from "./prompts/health-advice-prompt";
import { BaseAIService, HealthAdviceResponse, RecipeResponse } from "./base";
import { Ai, AiModels } from "@cloudflare/workers-types";
import { Bindings } from "@/index";
import {
  CLOUDFLARE_SCHEMAS,
  RecipeRecommendationSchema,
} from "@shared/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";
import { MessageType } from "@shared/types/chat";

export class CloudflareAIService extends BaseAIService {
  private ai: Ai;

  constructor(config: AIConfig, env: Bindings) {
    super(config, env);
    this.ai = env.AI;
    this.model = config.model || DEFAULT_MODELS.cloudflare;

    if (!this.ai) {
      throw new Error("Cloudflare Workers AI binding is required");
    }
  }

  protected parseResponse(data: any): string {
    return data.response || data.content || "";
  }

  async chat(
    messages: Message[],
    intent: MessageType,
    format?: ResponseFormat
  ): Promise<string | ReadableStream | RecipeResponse | HealthAdviceResponse> {
    const responseFormat = format || this.defaultFormat;
    // 当使用 JSON Schema 时，强制禁用流式响应
    const isStream = responseFormat === "event-stream" && intent === "chat";

    try {
      // 根据 intent 选择对应的 prompt 和 schema
      let systemPrompt = CHAT_PROMPT;
      let jsonSchema = undefined;
      let responseSchema = undefined;

      switch (intent) {
        case "recipe":
          systemPrompt = RECIPE_PROMPT;
          jsonSchema = zodToJsonSchema(RecipeRecommendationSchema);
          responseSchema = z.object({
            response: RecipeRecommendationSchema,
          });
          break;
        case "health_advice":
          systemPrompt = HEALTH_ADVICE_PROMPT;
          jsonSchema = zodToJsonSchema(CLOUDFLARE_SCHEMAS.healthAdvice);
          responseSchema = z.object({
            response: CLOUDFLARE_SCHEMAS.healthAdvice,
          });
          break;
        default:
          responseSchema = z.object({
            response: z.string(),
          });
      }

      // 添加系统提示到消息列表的开头
      const messagesWithPrompt = [
        { role: "system", content: systemPrompt },
        ...messages,
      ];

      let options: AiModels[keyof AiModels]["inputs"] = {
        messages: messagesWithPrompt.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      };

      if (isStream) {
        options = {
          ...options,
          stream: true,
        };
      }

      if (["recipe", "health_advice"].includes(intent)) {
        options = {
          ...options,
          max_tokens: 80000,
        };
      }

      if (jsonSchema) {
        options = {
          ...options,
          response_format: {
            type: "json_schema",
            json_schema: jsonSchema,
          },
        };
      }

      const result = await this.ai.run(this.model as keyof AiModels, options);

      // 如果是流式响应，直接返回
      if (isStream) {
        return result as ReadableStream;
      }

      try {
        const parsed = responseSchema.parse(result);
        return parsed.response;
      } catch (error) {
        console.error("Failed to parse response:", error);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Cloudflare AI chat error:", error);
      throw new Error("Failed to get response from Cloudflare AI");
    }
  }

  async getIntent(messages: Message[]): Promise<string> {
    try {
      const options: AiModels[keyof AiModels]["inputs"] = {
        messages: [{ role: "system", content: INTENT_PROMPT }, ...messages],
        max_tokens: 100,
        response_format: {
          type: "json_schema",
          json_schema: zodToJsonSchema(CLOUDFLARE_SCHEMAS.intent),
        },
      };

      const result = await this.ai.run(this.model as keyof AiModels, options);

      const parsed = z
        .object({
          response: CLOUDFLARE_SCHEMAS.intent,
        })
        .parse(result);

      return parsed.response.intent;
    } catch (error) {
      console.error("Cloudflare AI getIntent error:", error);
      return "chat";
    }
  }
}
