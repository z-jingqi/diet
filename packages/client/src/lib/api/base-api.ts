import { API_BASE } from "@/lib/constants";

type RequestInit = globalThis.RequestInit;

// 获取 CSRF token
const getCsrfToken = (): string | null => {
  return localStorage.getItem('csrf_token');
};

// 设置 CSRF token
const setCsrfToken = (token: string): void => {
  localStorage.setItem('csrf_token', token);
};

// 清除 CSRF token
const clearCsrfToken = (): void => {
  localStorage.removeItem('csrf_token');
};

// 自动刷新 session token 的 fetch 封装
export const fetchWithRefresh = async (input: string, init?: RequestInit, retry = true): Promise<Response> => {
  // 添加 CSRF token 到请求头
  const csrfToken = getCsrfToken();
  const headers = {
    ...init?.headers,
    ...(csrfToken && { 'X-CSRF-Token': csrfToken })
  };

  let response = await fetch(input, { 
    ...init, 
    credentials: 'include',
    headers
  });

  if (response.status === 401 && retry) {
    // 尝试刷新 session token
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      // 更新 CSRF token
      if (refreshData.csrf_token) {
        setCsrfToken(refreshData.csrf_token);
      }
      
      // 刷新成功，重试原请求
      response = await fetch(input, { 
        ...init, 
        credentials: 'include',
        headers: {
          ...headers,
          ...(refreshData.csrf_token && { 'X-CSRF-Token': refreshData.csrf_token })
        }
      });
    } else {
      // 刷新失败，清除 CSRF token
      clearCsrfToken();
      return response;
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
}: {
  messages: any[];
  systemPrompt: string;
  format?: "stream" | "json";
  signal?: AbortSignal;
  onStreamMessage?: (data: any) => void;
  onStreamError?: (error: Error) => void;
}) => {
  const response = await fetchWithRefresh(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({
      messages,
      system_prompt: systemPrompt,
      format,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "请求失败");
  }

  if (format === "stream") {
    if (!response.body) {
      throw new Error("响应流不可用");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              onStreamMessage?.({ done: true });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              onStreamMessage?.(parsed);
            } catch (e) {
              console.error("解析流数据失败:", e);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
      onStreamError?.(error as Error);
    }
  } else {
    return response.json();
  }
};

// 导出 CSRF token 管理函数
export { getCsrfToken, setCsrfToken, clearCsrfToken };
