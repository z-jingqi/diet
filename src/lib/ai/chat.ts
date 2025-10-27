import { streamText } from "ai";
import { openrouterProvider } from "@/lib/ai/openrouter";
import { AI_CONFIG } from "@/config/ai";

export async function generateChatReply(prompt: string) {
  const response = streamText({
    model: openrouterProvider.chat(AI_CONFIG.openrouter.defaultModel),
    prompt,
    system:
      "You are DietAI, a friendly cooking assistant. Provide concise and helpful answers.",
  });

  await response.consumeStream();
  return response.text;
}
