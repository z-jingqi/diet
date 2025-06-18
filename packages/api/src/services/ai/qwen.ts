import { AIConfig, ResponseFormat, DEFAULT_MODELS } from "./types";
import { INTENT_PROMPT } from "./prompts/intent-prompt";
import { CHAT_PROMPT } from "./prompts/chat-prompt";
import { RECIPE_PROMPT } from "./prompts/recipe-prompt";
import { HEALTH_ADVICE_PROMPT } from "./prompts/health-advice-prompt";
import { BaseAIService } from "./base";
import { Bindings } from "@/index";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

export class QwenService extends BaseAIService {
  openai: OpenAI;
  model: string;

  constructor(config: AIConfig, env: Bindings) {
    super(config, env);
    const apiKey = config?.apiKey || env?.DASHSCOPE_API_KEY || "";
    this.model = config?.model || env?.QWEN_MODEL || DEFAULT_MODELS.qwen;
    // Qwen OpenAI 兼容 endpoint
    const baseURL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
    if (!apiKey) {
      throw new Error("DashScope API Key is required");
    }
    this.openai = new OpenAI({
      apiKey,
      baseURL,
      dangerouslyAllowBrowser: true, // 若在浏览器端调试
    });
  }

  // 兼容 OpenAI 格式的消息
  private toOpenAIMessages(messages: { role: string; content: string }[]) {
    return messages.map((msg) => ({ role: msg.role, content: msg.content }));
  }

  async chat(
    messages: { role: string; content: string }[],
    intent: string,
    format?: ResponseFormat
  ): Promise<string> {
    // 根据 intent 选择 system prompt
    let systemPrompt = CHAT_PROMPT;
    switch (intent) {
      case "recipe":
        systemPrompt = RECIPE_PROMPT;
        break;
      case "health_advice":
        systemPrompt = HEALTH_ADVICE_PROMPT;
        break;
    }
    // 拼接 system prompt
    const messagesWithPrompt = [
      { role: "system", content: systemPrompt },
      ...this.toOpenAIMessages(messages),
    ] as ChatCompletionMessageParam[];
    // 只支持非流式（如需流式可扩展）
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: messagesWithPrompt,
    });
    return completion.choices[0].message.content || "";
  }

  async getIntent(
    messages: { role: string; content: string }[]
  ): Promise<string> {
    // intent prompt
    const messagesWithPrompt = [
      { role: "system", content: INTENT_PROMPT },
      ...this.toOpenAIMessages(messages),
    ] as ChatCompletionMessageParam[];
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: messagesWithPrompt,
    });
    const intent = (completion.choices[0].message.content || "")
      .trim()
      .toLowerCase();
    if (!["chat", "recipe", "health_advice"].includes(intent)) {
      return "chat";
    }
    return intent;
  }
}
