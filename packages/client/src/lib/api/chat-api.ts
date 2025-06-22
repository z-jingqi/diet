import type { MessageType } from "@diet/shared";
import type { RecipeRecommendation, HealthAdvice } from "@shared/schemas";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { API_BASE } from "@/lib/constants";
import {
  CHAT_PROMPT,
  INTENT_PROMPT,
  RECIPE_PROMPT,
  RECIPE_CHAT_PROMPT,
  HEALTH_ADVICE_PROMPT,
  HEALTH_ADVICE_CHAT_PROMPT,
} from "@shared/prompts";

// 通用的聊天方法
const sendMessage = async (
  messages: { role: string; content: string }[],
  systemPrompt: string,
  format: "json" | "stream" = "json",
  signal?: AbortSignal,
  onStreamMessage?: (data: any) => void,
  onStreamError?: (error: Error) => void
): Promise<any> => {
  const messagesWithPrompt = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  if (format === "stream") {
    return new Promise<void>((resolve, reject) => {
      fetchEventSource(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "text/event-stream",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          messages: messagesWithPrompt,
          format: "stream",
        }),
        signal,
        onmessage(event: EventSourceMessage) {
          try {
            const data = JSON.parse(event.data);
            onStreamMessage?.(data);
          } catch (error) {
            console.error("Failed to parse SSE data:", error);
          }
        },
        onerror(error: Error) {
          onStreamError?.(error);
          reject(error);
        },
        onclose() {
          resolve();
        },
      });
    });
  }

  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messagesWithPrompt,
      format: "json",
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return typeof data.response === "string"
    ? JSON.parse(data.response)
    : data.response;
};

// 获取意图 - 通过发送带有INTENT_PROMPT的消息
export const getIntent = async (
  messages: { role: string; content: string }[],
  signal?: AbortSignal
): Promise<MessageType> => {
  try {
    const result = await sendMessage(messages, INTENT_PROMPT, "json", signal);
    const intent = result.intent?.trim()?.toLowerCase();

    if (!["chat", "recipe", "health_advice"].includes(intent)) {
      return "chat";
    }
    return intent as MessageType;
  } catch (error) {
    console.error("Failed to parse intent response:", error);
    return "chat";
  }
};

// 发送聊天消息（流式）- 使用CHAT_PROMPT
export const sendChatMessage = async (
  messages: { role: string; content: string }[],
  onMessage: (data: any) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> => {
  return sendMessage(
    messages,
    CHAT_PROMPT,
    "stream",
    signal,
    onMessage,
    onError
  );
};

// 发送菜谱聊天消息（流式）- 使用RECIPE_CHAT_PROMPT
export const sendRecipeChatMessage = async (
  messages: { role: string; content: string }[],
  onMessage: (data: any) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> => {
  return sendMessage(
    messages,
    RECIPE_CHAT_PROMPT,
    "stream",
    signal,
    onMessage,
    onError
  );
};

// 发送菜谱消息（JSON）- 使用RECIPE_PROMPT
export const sendRecipeMessage = async (
  messages: { role: string; content: string }[],
  signal?: AbortSignal
): Promise<RecipeRecommendation> => {
  return sendMessage(messages, RECIPE_PROMPT, "json", signal);
};

// 根据菜谱名称生成详细菜谱
export const generateRecipeByName = async (
  recipeName: string,
  signal?: AbortSignal
): Promise<RecipeRecommendation> => {
  const messages = [
    {
      role: "user",
      content: `请生成"${recipeName}"的详细菜谱，包括食材、步骤、营养信息等。`,
    },
  ];
  return sendMessage(messages, RECIPE_PROMPT, "json", signal);
};

// 发送健康建议聊天消息（流式）- 使用HEALTH_ADVICE_CHAT_PROMPT
export const sendHealthAdviceChatMessage = async (
  messages: { role: string; content: string }[],
  onMessage: (data: any) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> => {
  return sendMessage(
    messages,
    HEALTH_ADVICE_CHAT_PROMPT,
    "stream",
    signal,
    onMessage,
    onError
  );
};

// 发送健康建议消息（JSON）- 使用HEALTH_ADVICE_PROMPT
export const sendHealthAdviceMessage = async (
  messages: { role: string; content: string }[],
  signal?: AbortSignal
): Promise<HealthAdvice> => {
  return sendMessage(messages, HEALTH_ADVICE_PROMPT, "json", signal);
};
