import {
  AIConfig,
  ResponseFormat,
  DEFAULT_MODELS,
  RecipeResponse,
  HealthAdviceResponse,
} from "./types";
import { INTENT_PROMPT } from "./prompts/intent-prompt";
import { CHAT_PROMPT } from "./prompts/chat-prompt";
import { RECIPE_PROMPT } from "./prompts/recipe-prompt";
import { HEALTH_ADVICE_PROMPT } from "./prompts/health-advice-prompt";
import { Bindings } from "@/index";
import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources";
import { Stream } from "openai/core/streaming";

export class QwenService {
  openai: OpenAI;
  model: string;

  constructor(config: AIConfig, env: Bindings) {
    const apiKey = config?.apiKey || env?.QWEN_API_KEY || "";
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
    format: ResponseFormat = "stream"
  ): Promise<string | ReadableStream | RecipeResponse | HealthAdviceResponse> {
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
    const isStream = format === "stream" && intent === "chat";
    // 拼接 system prompt
    const messagesWithPrompt = [
      { role: "system", content: systemPrompt },
      ...this.toOpenAIMessages(messages),
    ] as ChatCompletionMessageParam[];

    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: messagesWithPrompt,
      response_format: isStream ? undefined : { type: "json_object" },
      stream: isStream,
    });
    if (isStream) {
      const stream = completion as Stream<ChatCompletionChunk>;
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || "";
              const finishReason = chunk.choices[0]?.finish_reason;
              
              if (content) {
                // 格式化为 SSE 格式
                const sseData = `data: ${JSON.stringify({ response: content })}\n\n`;
                controller.enqueue(new TextEncoder().encode(sseData));
              }
              
              // 检查流是否结束
              if (finishReason) {
                // 发送结束标记，包含结束原因
                const doneData = `data: ${JSON.stringify({ done: true, finish_reason: finishReason })}\n\n`;
                controller.enqueue(new TextEncoder().encode(doneData));
                controller.close();
                break;
              }
            }
          } catch (error) {
            controller.error(error);
          }
        },
      });
    }
    return (completion as ChatCompletion).choices[0].message.content || "";
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
      response_format: { type: "json_object" },
    });

    try {
      const content = completion.choices[0].message.content || "";
      const parsed = JSON.parse(content);
      const intent = parsed.intent?.trim()?.toLowerCase();

      if (!["chat", "recipe", "health_advice"].includes(intent)) {
        return "chat";
      }
      return intent;
    } catch (error) {
      console.error("Failed to parse intent response:", error);
      return "chat";
    }
  }
}
