import type { UIMessage } from "ai";
import { extractTextFromUIMessage } from "./db/message-converter";

/**
 * Generate a conversation title from the first user message
 * Falls back to "New Conversation" if no user message is found
 */
export function generateConversationTitle(messages: UIMessage[]): string {
  const firstUserMessage = messages.find((m) => m.role === "user");

  if (!firstUserMessage) {
    return "New Conversation";
  }

  const text = extractTextFromUIMessage(firstUserMessage);
  
  // Take first 50 characters and add ellipsis if needed
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return "New Conversation";
  }

  if (trimmed.length <= 50) {
    return trimmed;
  }

  return trimmed.slice(0, 47) + "...";
}

