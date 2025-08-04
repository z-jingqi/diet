import { sendMessage } from "./base-api";
import { HealthAdvice } from "@diet/shared";
import { ChatCompletionMessageParam } from "openai/resources";
import { MessageType } from "@/lib/gql/graphql";
import {
  CHAT_PROMPT,
  HEALTH_ADVICE_CHAT_PROMPT,
  HEALTH_ADVICE_PROMPT,
  INTENT_PROMPT,
  RECIPE_CHAT_PROMPT,
} from "@/prompts";

// 获取意图 - 通过发送带有INTENT_PROMPT的消息
export const getIntent = async (
  messages: ChatCompletionMessageParam[],
  signal?: AbortSignal,
  isGuestMode = false,
): Promise<MessageType> => {
  try {
    const result = await sendMessage({
      messages,
      systemPrompt: INTENT_PROMPT,
      format: "json",
      signal,
      isGuestMode,
    });
    const intent = result.intent?.trim()?.toUpperCase();

    if (
      ![
        MessageType.Chat,
        MessageType.Recipe,
        MessageType.HealthAdvice,
      ].includes(intent)
    ) {
      return MessageType.Chat;
    }
    return intent as MessageType;
  } catch (error) {
    console.error("Failed to parse intent response:", error);
    return MessageType.Chat;
  }
};

// 发送聊天消息（流式）- 使用CHAT_PROMPT
export const sendChatMessage = async (
  messages: ChatCompletionMessageParam[],
  onMessage: (data: any) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal,
  isGuestMode = false,
): Promise<void> => {
  return sendMessage({
    messages,
    systemPrompt: CHAT_PROMPT,
    format: "stream",
    signal,
    onStreamMessage: onMessage,
    onStreamError: onError,
    isGuestMode,
  });
};

/**
 * 发送菜谱聊天消息
 */
export const sendRecipeChatMessage = async (
  messages: ChatCompletionMessageParam[],
  onMessage: (data: any) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal,
  isGuestMode = false,
  existingRecipes: string[] = [],
  dislikedRecipes: string[] = [],
): Promise<void> => {
  // 构建增强的系统提示，包含用户已有和不喜欢的菜谱信息
  let enhancedSystemPrompt = RECIPE_CHAT_PROMPT;

  if (existingRecipes.length > 0 || dislikedRecipes.length > 0) {
    enhancedSystemPrompt += "\n\n# 🚫 严格禁止推荐的菜谱：";

    if (existingRecipes.length > 0) {
      enhancedSystemPrompt += `\n\n**用户已有菜谱（绝对不要推荐）：**\n${existingRecipes.map((recipe) => `- ${recipe}`).join("\n")}`;
    }

    if (dislikedRecipes.length > 0) {
      enhancedSystemPrompt += `\n\n**用户不喜欢菜谱（绝对不要推荐）：**\n${dislikedRecipes.map((recipe) => `- ${recipe}`).join("\n")}`;
    }

    enhancedSystemPrompt += "\n\n**重要提醒：**";
    enhancedSystemPrompt +=
      "\n1. 上述菜谱绝对不能在推荐列表中出现，即使它们很符合用户需求";
    enhancedSystemPrompt += "\n2. 必须选择其他替代菜品来满足用户需求";
    enhancedSystemPrompt +=
      "\n3. 如果用户明确要求上述菜谱，请委婉地推荐相似但不同的菜品";
    enhancedSystemPrompt += "\n4. 这是系统强制要求，必须严格遵守";
  }

  return sendMessage({
    messages,
    systemPrompt: enhancedSystemPrompt,
    format: "stream",
    signal,
    onStreamMessage: onMessage,
    onStreamError: onError,
    isGuestMode,
  });
};

// 发送健康建议聊天消息（流式）- 使用HEALTH_ADVICE_CHAT_PROMPT
export const sendHealthAdviceChatMessage = async (
  messages: ChatCompletionMessageParam[],
  onMessage: (data: any) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal,
  isGuestMode = false,
): Promise<void> => {
  return sendMessage({
    messages,
    systemPrompt: HEALTH_ADVICE_CHAT_PROMPT,
    format: "stream",
    signal,
    onStreamMessage: onMessage,
    onStreamError: onError,
    isGuestMode,
  });
};

// 发送健康建议消息（JSON）- 使用HEALTH_ADVICE_PROMPT
export const sendHealthAdviceMessage = async (
  messages: ChatCompletionMessageParam[],
  signal?: AbortSignal,
  isGuestMode = false,
): Promise<HealthAdvice> => {
  return sendMessage({
    messages,
    systemPrompt: HEALTH_ADVICE_PROMPT,
    format: "json",
    signal,
    isGuestMode,
  });
};
