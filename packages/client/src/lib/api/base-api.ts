import { API_BASE } from "@/lib/constants";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";

type RequestInit = globalThis.RequestInit;

// Helper: 读取 cookie
const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

// 获取 CSRF token（从 cookie）
const getCsrfToken = (): string | null => {
  return readCookie("csrf-token");
};

// 检查是否已登录
const isLoggedIn = (): boolean => {
  // 可以通过检查是否有有效的csrf token来判断
  return getCsrfToken() !== null;
};

// 自动刷新 session token 的 fetch 封装
export const fetchWithRefresh = async (
  input: string,
  init?: RequestInit,
  retry = true
): Promise<Response> => {
  // 如果是游客模式，不添加认证相关的头
  // 这里需要从调用处传入游客状态，因为base-api不应该直接依赖store
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };

  // 检查是否是游客请求（通过URL判断）
  const isGuestRequest =
    typeof input === "string" && input.includes("/chat/guest");

  // 只有在非游客请求下才添加 CSRF token
  if (!isGuestRequest) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
  }

  let response = await fetch(input, {
    ...init,
    credentials: isGuestRequest ? "omit" : "include", // 游客模式不发送 cookies
    headers,
  });

  // 只有在非游客请求下才尝试刷新token
  if (response.status === 401 && retry && !isGuestRequest) {
    // 尝试刷新 session token
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      // 刷新成功，重试原请求
      response = await fetch(input, {
        ...init,
        credentials: "include",
        headers: {
          ...headers,
          ...(refreshData.csrf_token
            ? { "X-CSRF-Token": refreshData.csrf_token }
            : {}),
        },
      });
    }
  }

  return response;
};

// 通用的API调用方法
export const sendMessage = async ({
  messages,
  systemPrompt,
  format = "stream",
  signal,
  onStreamMessage,
  onStreamError,
  isGuestMode = false, // 新增参数，由调用方传入
}: {
  messages: any[];
  systemPrompt: string;
  format?: "stream" | "json";
  signal?: AbortSignal;
  onStreamMessage?: (data: any) => void;
  onStreamError?: (error: Error) => void;
  isGuestMode?: boolean; // 新增参数
}) => {
  // 根据用户状态选择端点
  const endpoint = isGuestMode ? `${API_BASE}/chat/guest` : `${API_BASE}/chat`;

  // 将 system prompt 作为第一条消息添加到消息数组中
  const messagesWithSystem = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...messages,
  ];

  const requestBody = {
    messages: messagesWithSystem,
    format,
  };

  if (format === "stream") {
    // 检查是否是游客请求（通过URL判断）
    const isGuestRequest = endpoint.includes("/chat/guest");

    // 准备请求头
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 只有在非游客请求下才添加 CSRF token
    if (!isGuestRequest) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken;
      }
    }

    await fetchEventSource(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      credentials: isGuestRequest ? "omit" : "include",
      signal,
      onmessage(event: EventSourceMessage) {
        const data = event.data;
        if (data === "[DONE]") {
          onStreamMessage?.({ done: true });
          return;
        }

        try {
          const parsed = JSON.parse(data);
          onStreamMessage?.(parsed);
        } catch (e) {
          console.error("解析流数据失败:", e, "Raw data:", data);
          onStreamError?.(e as Error);
        }
      },
      onopen: async (response) => {
        if (
          response.ok &&
          response.headers.get("content-type")?.includes("text/event-stream")
        ) {
          // Stream connection successful
        } else {
          console.error("Stream connection failed:", response.status);
        }
      },
      onerror(error) {
        console.error("Stream error:", error);
        onStreamError?.(error as Error);
        throw error;
      },
    });
  } else {
    const response = await fetchWithRefresh(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "请求失败");
    }

    const result = await response.json();
    return typeof result.response === "string"
      ? JSON.parse(result.response)
      : result.response;
  }
};

// 导出相关函数
export { getCsrfToken, isLoggedIn };
