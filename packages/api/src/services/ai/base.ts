import { Bindings } from "@/index";
import { AIService, Message, AIConfig, ResponseFormat } from "./types";
import { AiModels } from "@cloudflare/workers-types";
import { Recipe, HealthAdvice, RecipeRecommendation } from "@diet/shared/src/schemas";

export type RecipeResponse = RecipeRecommendation;
export type HealthAdviceResponse = HealthAdvice;

export abstract class BaseAIService implements AIService {
  protected apiKey: string;
  protected baseUrl: string = "";
  protected model: string | keyof AiModels;
  protected defaultFormat: ResponseFormat = "event-stream";
  protected env: Bindings;

  constructor(config: AIConfig, env: Bindings) {
    this.apiKey = config?.apiKey || "";
    this.model = config?.model || "";
    this.defaultFormat = config?.defaultResponseFormat || "event-stream";
    this.env = env;
  }

  protected async makeRequest(url: string, body: any, format: ResponseFormat = "json", headers: Record<string, string> = {}): Promise<string | ReadableStream> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: format === "event-stream" ? "text/event-stream" : "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    if (format === "event-stream") {
      return response.body as ReadableStream;
    }

    const data = await response.json();
    return this.parseResponse(data);
  }

  protected abstract parseResponse(data: any): string;

  abstract chat(messages: Message[], intent: string, format?: ResponseFormat): Promise<string | ReadableStream | RecipeResponse | HealthAdviceResponse>;
  abstract getIntent(messages: Message[]): Promise<string>;
}
