export const AI_CONFIG = {
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
    defaultModel:
      process.env.OPENROUTER_DEFAULT_MODEL ?? "openai/gpt-oss-20b:free",
    recipeModel: process.env.OPENROUTER_RECIPE_MODEL ?? "minimax/minimax-m2:free",
  },
} as const;

if (!AI_CONFIG.openrouter.apiKey) {
  throw new Error("Missing OPENROUTER_API_KEY environment variable.");
}
