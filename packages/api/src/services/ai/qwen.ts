import { AIConfig, ResponseFormat, DEFAULT_MODELS } from "./types";
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

  async chat(
    messages: ChatCompletionMessageParam[],
    format: ResponseFormat = "stream"
  ): Promise<string | ReadableStream> {
    const isStream = format === "stream";

    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages,
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
}
