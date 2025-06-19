import { AIConfig } from "./types";
import { QwenService } from "./qwen";
import { CloudflareAIService } from "./cloudflare";
import { Bindings } from "@/index";

export const AIServiceFactory = {
  create: (
    config: AIConfig,
    env: Bindings
  ): QwenService | CloudflareAIService => {
    switch (config.type) {
      case "qwen":
        return new QwenService(config, env);
      case "cloudflare":
        return new CloudflareAIService(config, env);
      default:
        throw new Error(`Unsupported AI service type: ${config.type}`);
    }
  },
};
