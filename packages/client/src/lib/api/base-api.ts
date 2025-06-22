import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { API_BASE } from "@/lib/constants";
import { ChatCompletionMessageParam } from "openai/resources";
import { getAuthHeaders } from "./auth-api";

// 定义 sendMessage 的参数接口
interface SendMessageParams {
  messages: ChatCompletionMessageParam[];
  systemPrompt: string;
  format?: "json" | "stream";
  signal?: AbortSignal;
  onStreamMessage?: (data: any) => void;
  onStreamError?: (error: Error) => void;
}

// 通用的API调用方法
export const sendMessage = async ({
  messages,
  systemPrompt,
  format = "json",
  signal,
  onStreamMessage,
  onStreamError,
}: SendMessageParams): Promise<any> => {
  const messagesWithPrompt = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  // 获取认证头
  const authHeaders = getAuthHeaders();

  if (format === "stream") {
    return new Promise<void>((resolve, reject) => {
      fetchEventSource(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "text/event-stream",
          Accept: "text/event-stream",
          ...authHeaders,
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
      ...authHeaders,
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
