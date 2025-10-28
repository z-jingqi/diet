import { convertToModelMessages, streamText } from "ai";
import { openrouterProvider } from "@/lib/ai/openrouter";
import { AI_CONFIG } from "@/config/ai";

type ChatRequestBody = {
  messages: unknown;
};

export async function handleChatRequest(request: Request): Promise<Response> {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages } = body;

  if (!Array.isArray(messages)) {
    return Response.json({ error: "Missing messages array" }, { status: 400 });
  }

  const result = streamText({
    model: openrouterProvider.chat(AI_CONFIG.openrouter.defaultModel),
    messages: convertToModelMessages(messages),
    system:
      "You are DietAI, a friendly cooking assistant. Provide concise and helpful answers.",
  });

  return result.toUIMessageStreamResponse();
}
