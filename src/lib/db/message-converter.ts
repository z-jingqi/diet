/**
 * Utilities for converting between Prisma Message and Vercel AI SDK UIMessage
 */

import type { Message as PrismaMessage } from "@prisma/client";
import type { UIMessage } from "ai";
import type { ChatMessageMetadata } from "@/types/chat";

/**
 * Convert Prisma Message to UIMessage
 */
export function prismaMessageToUIMessage(
  message: PrismaMessage
): UIMessage<ChatMessageMetadata> {
  return {
    id: message.id,
    role: message.role as "system" | "user" | "assistant",
    parts: message.parts as UIMessage["parts"],
    metadata: message.metadata as ChatMessageMetadata | undefined,
  };
}

/**
 * Convert UIMessage to Prisma Message data
 */
export function uiMessageToPrismaData(message: UIMessage<ChatMessageMetadata>) {
  return {
    id: message.id,
    role: message.role,
    parts: message.parts,
    metadata: message.metadata,
  };
}

/**
 * Helper to extract plain text content from UIMessage parts
 * Useful for backwards compatibility or when you need simple text
 */
export function extractTextFromUIMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => ("text" in part ? part.text : ""))
    .join("");
}

/**
 * Helper to create a simple text UIMessage
 * Useful when creating new messages programmatically
 */
export function createTextUIMessage(
  id: string,
  role: "system" | "user" | "assistant",
  text: string,
  metadata?: ChatMessageMetadata
): UIMessage<ChatMessageMetadata> {
  return {
    id,
    role,
    parts: [{ type: "text", text }],
    metadata,
  };
}

