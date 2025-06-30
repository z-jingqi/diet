import { sendMessage } from "./base-api";
import {
  HealthAdvice,
  CHAT_PROMPT,
  INTENT_PROMPT,
  RECIPE_CHAT_PROMPT,
  HEALTH_ADVICE_PROMPT,
  HEALTH_ADVICE_CHAT_PROMPT,
} from "@diet/shared";
import { ChatCompletionMessageParam } from "openai/resources";
import { MessageType } from "@/lib/gql/graphql";

// 获取意图 - 通过发送带有INTENT_PROMPT的消息
export const getIntent = async (
  messages: ChatCompletionMessageParam[],
  signal?: AbortSignal,
  isGuestMode = false
): Promise<MessageType> => {
  try {
    const result = await sendMessage({
      messages,
      systemPrompt: INTENT_PROMPT,
      format: "json",
      signal,
      isGuestMode,
    });
    const intent = result.intent?.trim()?.toLowerCase();

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
  isGuestMode = false
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

// 发送菜谱聊天消息（流式）- 使用RECIPE_CHAT_PROMPT
export const sendRecipeChatMessage = async (
  messages: ChatCompletionMessageParam[],
  onMessage: (data: any) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal,
  isGuestMode = false
): Promise<void> => {
  return sendMessage({
    messages,
    systemPrompt: RECIPE_CHAT_PROMPT,
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
  isGuestMode = false
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
  isGuestMode = false
): Promise<HealthAdvice> => {
  return sendMessage({
    messages,
    systemPrompt: HEALTH_ADVICE_PROMPT,
    format: "json",
    signal,
    isGuestMode,
  });
};
