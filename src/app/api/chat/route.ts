import { NextResponse } from "next/server";
import { convertToModelMessages, streamText } from "ai";
import { openrouterProvider } from "@/lib/ai/openrouter";
import { AI_CONFIG } from "@/config/ai";

export const runtime = "edge";

export async function POST(request: Request) {
  const { messages } = await request.json();

  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "Missing messages array" }, { status: 400 });
  }

  const result = streamText({
    model: openrouterProvider.chat(AI_CONFIG.openrouter.defaultModel),
    messages: convertToModelMessages(messages),
    system:
      "You are DietAI, a friendly cooking assistant. Provide concise and helpful answers.",
  });

  return result.toUIMessageStreamResponse();
}
