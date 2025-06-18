import { create } from "zustand";
import type { Message, MessageType } from "@shared/types/chat";
import type { RecipeRecommendation } from "@shared/schemas/recipe";
import { buildMessage, buildUserMessage } from "@/utils/message-builder";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { HealthAdvice } from "@shared/schemas";

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  sendMessage: (content: string) => Promise<void>;
  getIntent: (
    messages: { role: string; content: string }[]
  ) => Promise<MessageType>;
  sendChatMessage: (
    messages: { role: string; content: string }[]
  ) => Promise<string>;
  sendRecipeMessage: (
    messages: { role: string; content: string }[]
  ) => Promise<RecipeRecommendation>;
  sendHealthAdviceMessage: (
    messages: { role: string; content: string }[]
  ) => Promise<HealthAdvice>;
  isLoading: boolean;
  error: string | null;
  resetMessages: () => void;
  canSendMessage: () => boolean;
}

const toAIMessages = (
  messages: Message[]
): { role: string; content: string }[] => {
  return messages.map((msg) => {
    if (msg.isUser) {
      return { role: "user", content: msg.content };
    }
    // assistant 消息：如果是 recipe/health_advice，序列化为字符串
    if (msg.type === "recipe" && msg.recipes) {
      return {
        role: "assistant",
        content: `以下是推荐菜谱数据：\n${JSON.stringify({ description: msg.content, recipes: msg.recipes }, null, 2)}`,
      };
    }
    if (msg.type === "health_advice" && msg.healthAdvice) {
      return {
        role: "assistant",
        content: `以下是健康建议数据：\n${JSON.stringify(msg.healthAdvice, null, 2)}`,
      };
    }
    // 普通 assistant 消息
    return { role: "assistant", content: msg.content };
  });
};

const useChatStore = create<
  ChatState & {
    abortController?: AbortController;
    abortCurrentMessage: () => void;
  }
>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  abortController: undefined,

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  getIntent: async (messages) => {
    const controller = new AbortController();
    set({ abortController: controller });
    const response = await fetch("/api/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });
    set({ abortController: undefined });
    if (!response.ok) {
      throw new Error("Failed to get intent");
    }
    const { response: intent } = await response.json();
    return intent as MessageType;
  },

  sendChatMessage: async (messages) => {
    let result = "";
    const { messages: stateMessages } = get();
    const currentMessage = stateMessages[stateMessages.length - 1];
    const controller = new AbortController();
    set({ abortController: controller });
    await fetchEventSource("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ messages, intent: "chat" as MessageType }),
      signal: controller.signal,
      onmessage(event: EventSourceMessage) {
        try {
          if (event.data === "[DONE]") {
            set({ abortController: undefined });
            return;
          }
          const data = JSON.parse(event.data);
          if (data.response !== null && data.response !== undefined) {
            result += data.response;
            set((state) => ({
              messages: state.messages.map((msg) => {
                if (msg.id === currentMessage.id) {
                  return { ...msg, content: result };
                }
                return msg;
              }),
            }));
          }
        } catch (error) {
          console.error("Failed to parse SSE data:", error);
        }
      },
      onerror(error: Error) {
        set({ abortController: undefined });
        console.error("SSE error:", error);
        throw error;
      },
    });
    set({ abortController: undefined });
    return result;
  },

  sendRecipeMessage: async (messages) => {
    const controller = new AbortController();
    set({ abortController: controller });
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, intent: "recipe", format: "json" }),
      signal: controller.signal,
    });
    set({ abortController: undefined });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.response as RecipeRecommendation;
  },

  sendHealthAdviceMessage: async (messages) => {
    const controller = new AbortController();
    set({ abortController: controller });
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        intent: "health_advice" as MessageType,
      }),
      signal: controller.signal,
    });
    set({ abortController: undefined });
    if (!response.ok) {
      throw new Error("Failed to get health advice");
    }
    const data = await response.json();
    return data.response as HealthAdvice;
  },

  abortCurrentMessage: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ abortController: undefined });
      // 标记最后一条AI消息为 error
      set((state) => ({
        messages: state.messages.map((msg, idx, arr) =>
          !msg.isUser && idx === arr.length - 1
            ? { ...msg, status: "error", finishedAt: new Date() }
            : msg
        ),
      }));
    }
  },

  sendMessage: async (content: string) => {
    const {
      addMessage,
      getIntent,
      sendChatMessage,
      sendRecipeMessage,
      sendHealthAdviceMessage,
    } = get();

    // 1. 先把用户消息加到本地消息队列
    const userMessage = buildUserMessage(content);
    addMessage(userMessage);

    // 2. 组装上下文（所有历史消息+当前用户消息）
    const allMessages = [...get().messages];
    const AIMessages = toAIMessages(allMessages);

    try {
      // 3. 获取意图
      const intent = await getIntent(AIMessages);

      switch (intent) {
        case "recipe": {
          const message = buildMessage("recipe");
          message.status = "pending";
          addMessage(message);
          const result = await sendRecipeMessage(AIMessages);
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === message.id
                ? {
                    ...msg,
                    recipes: result.recipes,
                    content: result.description,
                    status: "done",
                    finishedAt: new Date(),
                  }
                : msg
            ),
          }));
          break;
        }
        case "health_advice": {
          const message = buildMessage("health_advice");
          message.status = "pending";
          addMessage(message);
          const result = await sendHealthAdviceMessage(AIMessages);
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === message.id
                ? {
                    ...msg,
                    healthAdvice: result,
                    content: result.title,
                    status: "done",
                    finishedAt: new Date(),
                  }
                : msg
            ),
          }));
          break;
        }
        default: {
          const message = buildMessage("chat");
          message.status = "streaming";
          addMessage(message);
          try {
            await sendChatMessage(AIMessages);
            set((state) => ({
              messages: state.messages.map((msg) =>
                msg.id === message.id
                  ? { ...msg, status: "done", finishedAt: new Date() }
                  : msg
              ),
            }));
          } catch (error) {
            set((state) => ({
              messages: state.messages.map((msg) =>
                msg.id === message.id
                  ? { ...msg, status: "error", finishedAt: new Date() }
                  : msg
              ),
            }));
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // 找到最后一条 AI 消息，标记为 error
      set((state) => ({
        messages: state.messages.map((msg, idx, arr) =>
          !msg.isUser && idx === arr.length - 1
            ? { ...msg, status: "error", finishedAt: new Date() }
            : msg
        ),
      }));
    }
  },

  resetMessages: () => {
    set({ messages: [] });
  },

  canSendMessage: () => {
    const { messages } = get();
    if (messages.length === 0) {
      return true;
    }
    const last = messages[messages.length - 1];
    // 如果最后一条是用户消息，说明AI还没回复
    if (last.isUser) {
      return false;
    }
    // 如果最后一条AI消息还在处理中
    if (last.status === "pending" || last.status === "streaming") {
      return false;
    }
    return true;
  },
}));

export default useChatStore;
