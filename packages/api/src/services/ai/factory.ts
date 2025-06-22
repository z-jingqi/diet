import { AIConfig } from "./types";
import { QwenService } from "./qwen";
import { Bindings } from "../../types/bindings";

export const AIServiceFactory = {
  create: (config: AIConfig, env: Bindings): QwenService => {
    switch (config.type) {
      case "qwen":
        return new QwenService(config, env);
      default:
        throw new Error(`Unsupported AI service type: ${config.type}`);
    }
  },
};
