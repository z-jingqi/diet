import { create } from "zustand";
import type { Message, MessageType } from "@shared/types/chat";
import type { RecipeRecommendation } from "@shared/schemas/recipe";
import type { Tag } from "@shared/schemas";
import { buildMessage, buildUserMessage } from "@/utils/message-builder";
import { toAIMessages, areTagsEqual } from "@/utils/chat-utils";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { HealthAdvice } from "@shared/schemas";

interface ChatState {
  messages: Message[];
  currentTags: Tag[]; // 跟踪当前使用的标签
  addMessage: (message: Message) => void;
  sendMessage: (content: string, tags?: Tag[]) => Promise<void>;
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

const useChatStore = create<
  ChatState & {
    abortController?: AbortController;
    abortCurrentMessage: () => void;
  }
>((set, get) => ({
  messages: [],
  currentTags: [],
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
        "Content-Type": "text/event-stream",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ messages, intent: "chat" as MessageType }),
      signal: controller.signal,
      onmessage(event: EventSourceMessage) {
        try {
          const data = JSON.parse(event.data);

          // 检查流是否结束
          if (data.done) {
            set({ abortController: undefined });
            return;
          }

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
    const result =
      typeof data.response === "string"
        ? JSON.parse(data.response)
        : data.response;
    return result as RecipeRecommendation;
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
    const result =
      typeof data.response === "string"
        ? JSON.parse(data.response)
        : data.response;
    return result as HealthAdvice;
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

  sendMessage: async (content: string, tags?: Tag[]) => {
    const {
      addMessage,
      getIntent,
      sendChatMessage,
      sendRecipeMessage,
      sendHealthAdviceMessage,
      currentTags,
    } = get();

    // 1. 先把用户消息加到本地消息队列（保持原始内容）
    const userMessage = buildUserMessage(content);
    addMessage(userMessage);

    // 2. 检查标签是否发生变化
    const tagsChanged = tags && !areTagsEqual(tags, currentTags);
    
    // 3. 如果标签发生变化，更新当前标签
    if (tagsChanged) {
      set({ currentTags: tags });
    }

    // 4. 组装上下文（所有历史消息+当前用户消息）
    const allMessages = [...get().messages];
    const AIMessages = toAIMessages(allMessages, tags, tagsChanged);

    try {
      // 5. 获取意图
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
      
      // 检查是否已经有 AI 消息（可能是在 getIntent 之后添加的）
      const { messages } = get();
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage && !lastMessage.isUser) {
        // 如果最后一条是 AI 消息，标记为 error
        set((state) => ({
          messages: state.messages.map((msg, idx, arr) =>
            !msg.isUser && idx === arr.length - 1
              ? { ...msg, status: "error", finishedAt: new Date() }
              : msg
          ),
        }));
      } else {
        // 如果没有 AI 消息（比如 getIntent 失败），添加一个错误消息
        const errorMessage = buildMessage("chat");
        errorMessage.status = "error";
        errorMessage.content = "抱歉，处理您的消息时出现了问题，请重试。";
        errorMessage.finishedAt = new Date();
        addMessage(errorMessage);
      }
    }
  },

  resetMessages: () => {
    set({ messages: [], currentTags: [] });
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
