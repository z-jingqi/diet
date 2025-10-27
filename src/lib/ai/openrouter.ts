import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { AI_CONFIG } from "@/config/ai";

export const openrouterProvider = createOpenRouter({
  apiKey: AI_CONFIG.openrouter.apiKey,
  baseURL: AI_CONFIG.openrouter.baseUrl,
});
