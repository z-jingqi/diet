import { create } from "zustand";
import type { Message, AIResponse, MessageType } from "@shared/types/chat";
import type { Recipe } from "@shared/types/recipe";
import { buildMessage, buildUserMessage } from "@/utils/message-builder";
import { fetchEventSource, EventSourceMessage } from "@microsoft/fetch-event-source";

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  sendMessage: (content: string, setCurrentRecipe: (recipe: Recipe) => void) => Promise<void>;
  getIntent: (content: string) => Promise<AIResponse["intent_type"]>;
  sendChatMessage: (content: string) => Promise<string>;
  sendRecipeMessage: (content: string) => Promise<{ description: string; recipes: Recipe[] }>;
  sendHealthAdviceMessage: (content: string) => Promise<AIResponse["content_body"]>;
}

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  getIntent: async (content: string) => {
    const response = await fetch("/api/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get intent");
    }

    const { response: intent } = await response.json();
    return intent as AIResponse["intent_type"];
  },

  sendChatMessage: async (content: string) => {
    let result = "";
    const { messages } = get();
    const currentMessage = messages[messages.length - 1];

    await fetchEventSource("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content }],
        intent: "chat" as MessageType,
      }),
      onmessage(event: EventSourceMessage) {
        try {
          if (event.data === "[DONE]") {
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
        console.error("SSE error:", error);
        throw error;
      },
    });
    return result;
  },

  sendRecipeMessage: async (content: string) => {
    let result = "";
    const { messages } = get();
    const currentMessage = messages[messages.length - 1];

    await fetchEventSource("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content }],
        intent: "recipe" as MessageType,
      }),
      onmessage(event: EventSourceMessage) {
        try {
          if (event.data === "[DONE]") {
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
        console.error("SSE error:", error);
        throw error;
      },
    });
    return JSON.parse(result) as { description: string; recipes: Recipe[] };
  },

  sendHealthAdviceMessage: async (content: string) => {
    let result = "";
    const { messages } = get();
    const currentMessage = messages[messages.length - 1];

    await fetchEventSource("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content }],
        intent: "health_advice" as MessageType,
      }),
      onmessage(event: EventSourceMessage) {
        try {
          if (event.data === "[DONE]") {
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
        console.error("SSE error:", error);
        throw error;
      },
    });
    return JSON.parse(result);
  },

  sendMessage: async (content: string) => {
    const { addMessage, getIntent, sendChatMessage, sendRecipeMessage: getRecipe, sendHealthAdviceMessage: getHealthAdvice } = get();

    const userMessage = buildUserMessage(content);
    addMessage(userMessage);

    try {
      const intent = await getIntent(content);

      switch (intent) {
        case "recipe": {
          // 创建一个初始的 recipe 消息
          const message = buildMessage("recipe");
          addMessage(message);

          // 获取菜谱数据，并实时更新消息内容
          getRecipe(content);
          break;
        }
        case "health_advice": {
          const message = buildMessage("health_advice");
          addMessage(message);
          getHealthAdvice(content);
          break;
        }
        default: {
          const message = buildMessage("chat");
          addMessage(message);
          sendChatMessage(content);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        id: `error-${Date.now()}`,
        content: "抱歉，我遇到了一些问题，请稍后再试。",
        type: "chat",
        isUser: false,
        createdAt: new Date(),
      });
    }
  },
}));

export default useChatStore;
