import { Message, AIConfig, ResponseFormat, DEFAULT_MODELS } from "./types";
import { INTENT_PROMPT } from "./prompts/intent-prompt";
import { CHAT_PROMPT } from "./prompts/chat-prompt";
import { RECIPE_PROMPT } from "./prompts/recipe-prompt";
import { HEALTH_ADVICE_PROMPT } from "./prompts/health-advice-prompt";
import { BaseAIService, ServiceEnv } from "./base";

interface BaiduTokenResponse {
  access_token: string;
}

interface BaiduChatResponse {
  result: string;
}

interface BaiduServiceEnv extends ServiceEnv {
  BAIDU_API_KEY?: string;
  BAIDU_SECRET_KEY?: string;
  BAIDU_MODEL?: string;
}

export class BaiduAIService extends BaseAIService {
  private apiSecret: string;
  private tokenUrl = "https://aip.baidubce.com/oauth/2.0/token";

  constructor(config?: AIConfig, env?: BaiduServiceEnv) {
    super(config, env);
    this.apiKey = config?.apiKey || env?.BAIDU_API_KEY || "";
    this.apiSecret = config?.apiSecret || env?.BAIDU_SECRET_KEY || "";
    this.model = config?.model || env?.BAIDU_MODEL || DEFAULT_MODELS.baidu;
    this.baseUrl = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat";

    if (!this.apiKey || !this.apiSecret) {
      throw new Error("Baidu API Key and Secret are required");
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.tokenUrl}?grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.apiSecret}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as BaiduTokenResponse;
      return data.access_token;
    } catch (error) {
      console.error("Failed to get access token:", error);
      throw new Error("Failed to get access token");
    }
  }

  protected parseResponse(data: any): string {
    return (data as BaiduChatResponse).result;
  }

  async chat(messages: Message[], intent: string, format?: ResponseFormat): Promise<string | ReadableStream> {
    const responseFormat = format || this.defaultFormat;
    try {
      const accessToken = await this.getAccessToken();

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

      const body = {
        messages: messagesWithPrompt.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: responseFormat === "event-stream",
      };

      return this.makeRequest(`${this.baseUrl}/${this.model}?access_token=${accessToken}`, body, responseFormat);
    } catch (error) {
      console.error("Baidu AI chat error:", error);
      throw new Error("Failed to get response from Baidu AI");
    }
  }

  async getIntent(messages: Message[]): Promise<string> {
    try {
      const accessToken = await this.getAccessToken();
      const result = (await this.makeRequest(`${this.baseUrl}/${this.model}?access_token=${accessToken}`, {
        messages: [
          {
            role: "system",
            content: INTENT_PROMPT,
          },
          ...messages,
        ],
      })) as string;

      const intent = result.trim().toLowerCase();

      // 确保返回的意图是有效的
      if (!["chat", "recipe", "health_advice"].includes(intent)) {
        return "chat";
      }

      return intent;
    } catch (error) {
      console.error("Baidu AI intent detection error:", error);
      throw new Error("Failed to get intent from Baidu AI");
    }
  }
}
