export const AI_CONFIG = {
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: "https://openrouter.ai/api/v1",
    // openai/gpt-oss-20b:free, minimax/minimax-m2:free
    defaultModel: "openai/gpt-oss-20b:free", // general chat
    recipeModel: "minimax/minimax-m2:free", // future: recipe generation
  },
} as const;

if (!AI_CONFIG.openrouter.apiKey) {
  throw new Error("Missing OPENROUTER_API_KEY environment variable.");
}
