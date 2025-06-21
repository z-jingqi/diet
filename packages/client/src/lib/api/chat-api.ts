import type { MessageType } from "@diet/shared";
import type { RecipeRecommendation, HealthAdvice } from "@shared/schemas";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { API_BASE } from "@/lib/constants";

// 获取意图
export const getIntent = async (
  messages: { role: string; content: string }[],
  signal?: AbortSignal
): Promise<MessageType> => {
  const response = await fetch(`${API_BASE}/intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to get intent");
  }

  const { response: intent } = await response.json();
  return intent as MessageType;
};

// 发送聊天消息（流式）
export const sendChatMessage = async (
  messages: { role: string; content: string }[],
  onMessage: (data: any) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> => {
  await fetchEventSource(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "text/event-stream",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ messages, intent: "chat" as MessageType }),
    signal,
    onmessage(event: EventSourceMessage) {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Failed to parse SSE data:", error);
      }
    },
    onerror(error: Error) {
      onError(error);
    },
  });
};

// 发送菜谱消息
export const sendRecipeMessage = async (
  messages: { role: string; content: string }[],
  signal?: AbortSignal
): Promise<RecipeRecommendation> => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, intent: "recipe", format: "json" }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const result =
    typeof data.response === "string"
      ? JSON.parse(data.response)
      : data.response;
  return result as RecipeRecommendation;
};

// 发送健康建议消息
export const sendHealthAdviceMessage = async (
  messages: { role: string; content: string }[],
  signal?: AbortSignal
): Promise<HealthAdvice> => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      intent: "health_advice" as MessageType,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to get health advice");
  }

  const data = await response.json();
  const result =
    typeof data.response === "string"
      ? JSON.parse(data.response)
      : data.response;
  return result as HealthAdvice;
}; 