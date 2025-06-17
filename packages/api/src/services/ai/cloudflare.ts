import { AIService, Message, AIConfig, ResponseFormat, DEFAULT_MODELS } from "./types";
import { INTENT_PROMPT } from "./prompts/intent-prompt";
import { CHAT_PROMPT } from "./prompts/chat-prompt";
import { RECIPE_PROMPT } from "./prompts/recipe-prompt";
import { HEALTH_ADVICE_PROMPT } from "./prompts/health-advice-prompt";
import { BaseAIService } from "./base";
import { Ai, AiModels } from "@cloudflare/workers-types";
import { Bindings } from "@/index";
import { RECIPE_SCHEMA } from "./schemas/recipe-schema";
import { INTENT_SCHEMA } from "./schemas/intent-schema";
import { HEALTH_ADVICE_SCHEMA } from "./schemas/health-advice-schema";

export class CloudflareAIService extends BaseAIService {
  private ai: Ai;

  constructor(config: AIConfig, env: Bindings) {
    super(config, env);
    this.ai = env.AI;
    this.model = (config?.model || env?.CLOUDFLARE_MODEL || DEFAULT_MODELS.cloudflare) as keyof AiModels;

    if (!this.ai) {
      throw new Error("Cloudflare Workers AI binding is required");
    }
  }

  protected parseResponse(data: any): string {
    return data.response;
  }

  async chat(messages: Message[], intent: string, format?: ResponseFormat): Promise<string | ReadableStream> {
    const responseFormat = format || this.defaultFormat;
    const isStream = responseFormat === "event-stream";

    try {
      // 根据 intent 选择对应的 prompt 和 schema
      let systemPrompt = CHAT_PROMPT;
      let jsonSchema = undefined;

      switch (intent) {
        case "recipe":
          systemPrompt = RECIPE_PROMPT;
          jsonSchema = RECIPE_SCHEMA;
          break;
        case "health_advice":
          systemPrompt = HEALTH_ADVICE_PROMPT;
          jsonSchema = HEALTH_ADVICE_SCHEMA;
          break;
      }

      // 添加系统提示到消息列表的开头
      const messagesWithPrompt = [{ role: "system", content: systemPrompt }, ...messages];

      const result = await this.ai.run(this.model as keyof AiModels, {
        messages: messagesWithPrompt.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: isStream,
        max_tokens: intent === "recipe" ? 2000 : 1000,
        response_format: jsonSchema ? {
          type: "json_schema",
          json_schema: jsonSchema
        } : undefined
      });

      // 如果是流式响应，直接返回
      if (isStream) {
        return result as ReadableStream;
      }

      // 如果是普通响应，解析并返回文本
      return this.parseResponse(result);
    } catch (error) {
      console.error("Cloudflare AI chat error:", error);
      throw new Error("Failed to get response from Cloudflare AI");
    }
  }

  async getIntent(messages: Message[]): Promise<string> {
    try {
      const result = await this.ai.run(this.model as keyof AiModels, {
        messages: [
          {
            role: "system",
            content: INTENT_PROMPT,
          },
          ...messages,
        ],
        response_format: {
          type: "json_schema",
          json_schema: INTENT_SCHEMA
        }
      });

      const intent = (result as { response: string }).response.trim().toLowerCase();

      // Ensure the returned intent is valid
      if (!["chat", "recipe", "health_advice"].includes(intent)) {
        return "chat";
      }

      return intent;
    } catch (error) {
      console.error("Cloudflare AI intent detection error:", error);
      throw new Error("Failed to get intent from Cloudflare AI");
    }
  }
}
