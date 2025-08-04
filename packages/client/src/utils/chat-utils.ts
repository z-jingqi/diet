import { nanoid } from "nanoid";
import {
  ChatMessage,
  ChatSession,
  MessageRole,
  MessageType,
  MessageStatus,
} from "@/lib/gql/graphql";
import { ChatCompletionMessageParam } from "openai/resources";

/**
 * Generate a title for a chat session based on the first user message
 */
export const generateChatSessionTitleV2 = (messages: ChatMessage[]): string => {
  const firstUserMessage = messages.find((m) => m.role === MessageRole.User);
  if (!firstUserMessage || !firstUserMessage.content) {
    return "New Chat";
  }

  const maxLength = 20;
  const content = firstUserMessage.content.trim();
  return content.length <= maxLength
    ? content
    : content.substring(0, maxLength) + "...";
};

/**
 * Create a new user message
 */
export const createUserMessageV2 = (content: string): ChatMessage => {
  return {
    id: nanoid(),
    role: MessageRole.User,
    content,
    type: MessageType.Chat,
    status: MessageStatus.Done,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Create a new AI message
 */
export const createAIMessageV2 = (
  type: MessageType = MessageType.Chat,
): ChatMessage => {
  return {
    id: nanoid(),
    role: MessageRole.Assistant,
    content: "",
    type,
    status: MessageStatus.Pending,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Convert chat messages to OpenAI format
 */
export const toAIMessagesV2 = (
  messages: ChatMessage[],
): ChatCompletionMessageParam[] => {
  return messages.map((msg) => ({
    role: msg.role as MessageRole,
    content: msg.content || "",
  }));
};

/**
 * Create a new empty chat session
 */
export const createEmptyChatSessionV2 = (
  id: string = nanoid(),
): ChatSession => {
  const now = new Date().toISOString();
  return {
    id,
    title: "New Chat",
    messages: [],
    tagIds: [],
    createdAt: now,
    updatedAt: now,
  } as ChatSession;
};

/**
 * Check if a message is in streaming state
 */
export const isMessageStreamingV2 = (message: ChatMessage): boolean => {
  return message.status === MessageStatus.Streaming;
};

/**
 * Check if user can send a message
 */
export const canSendMessageV2 = (
  messages: ChatMessage[],
  gettingIntent: boolean,
): boolean => {
  if (gettingIntent) {
    return false;
  }

  if (messages.length === 0) {
    return true;
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.role === MessageRole.User) {
    return false;
  }

  if (
    lastMessage.status === MessageStatus.Pending ||
    lastMessage.status === MessageStatus.Streaming
  ) {
    return false;
  }

  return true;
};
