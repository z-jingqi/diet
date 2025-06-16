import { Message, AIConfig, ResponseFormat, DEFAULT_MODELS } from "./types";
import { INTENT_PROMPT } from "./prompts/intent-prompt";
import { CHAT_PROMPT } from "./prompts/chat-prompt";
import { RECIPE_PROMPT } from "./prompts/recipe-prompt";
import { HEALTH_ADVICE_PROMPT } from "./prompts/health-advice-prompt";
import { BaseAIService, ServiceEnv } from "./base";

interface QwenChatResponse {
  output: {
    text: string;
  };
}

interface QwenServiceEnv extends ServiceEnv {
  DASHSCOPE_API_KEY?: string;
  QWEN_MODEL?: string;
}

export class QwenService extends BaseAIService {
  constructor(config?: AIConfig, env?: QwenServiceEnv) {
    super(config, env);
    this.apiKey = config?.apiKey || env?.DASHSCOPE_API_KEY || "";
    this.model = config?.model || env?.QWEN_MODEL || DEFAULT_MODELS.qwen;
    this.baseUrl = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

    if (!this.apiKey) {
      throw new Error("DashScope API Key is required");
    }
  }

  protected parseResponse(data: any): string {
    return (data as QwenChatResponse).output.text;
  }

  async chat(messages: Message[], intent: string, format?: ResponseFormat): Promise<string | ReadableStream> {
    const responseFormat = format || this.defaultFormat;
    try {
      // 根据 intent 选择对应的 prompt
      let systemPrompt = CHAT_PROMPT;
      switch (intent) {
        case "recipe":
          systemPrompt = RECIPE_PROMPT;
          break;
        case "health_advice":
          systemPrompt = HEALTH_ADVICE_PROMPT;
          break;
      }

      // 添加系统提示到消息列表的开头
      const messagesWithPrompt = [{ role: "system", content: systemPrompt }, ...messages];

      return this.makeRequest(
        this.baseUrl,
        {
          model: this.model,
          input: {
            messages: messagesWithPrompt.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          },
          parameters: {
            stream: responseFormat === "event-stream",
          },
        },
        responseFormat,
        {
          Authorization: `Bearer ${this.apiKey}`,
        }
      );
    } catch (error) {
      console.error("Qwen chat error:", error);
      throw new Error("Failed to get response from Qwen");
    }
  }

  async getIntent(messages: Message[]): Promise<string> {
    try {
      const result = (await this.makeRequest(
        this.baseUrl,
        {
          model: this.model,
          input: {
            messages: [
              {
                role: "system",
                content: INTENT_PROMPT,
              },
              ...messages,
            ],
          },
        },
        "json",
        {
          Authorization: `Bearer ${this.apiKey}`,
        }
      )) as string;

      const intent = result.trim().toLowerCase();

      // 确保返回的意图是有效的
      if (!["chat", "recipe", "health_advice"].includes(intent)) {
        return "chat";
      }

      return intent;
    } catch (error) {
      console.error("Qwen intent detection error:", error);
      throw new Error("Failed to get intent from Qwen");
    }
  }
}
