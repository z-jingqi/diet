import { create } from "zustand";
import type { Message, AIResponse } from "@shared/types/chat";
import type { Recipe } from "@shared/types/recipe";
import {
  buildMessageFromAIResponse,
  buildUserMessage,
} from "@/utils/message-builder";
import {
  INTENT_PROMPT,
  CHAT_PROMPT,
  RECIPE_PROMPT,
  FOOD_AVAILABILITY_PROMPT,
} from "@/prompts/chat-prompt";

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateLastMessage: (updater: (message: Message) => Message) => void;
  sendMessage: (
    content: string,
    setCurrentRecipe: (recipe: Recipe) => void
  ) => Promise<void>;
  getIntent: (content: string) => Promise<AIResponse["intent_type"]>;
  sendChatMessage: (content: string) => Promise<string>;
  getRecipe: (
    content: string,
    onChunk?: (chunk: string) => void
  ) => Promise<{ description: string; recipes: Recipe[] }>;
  getFoodAvailability: (content: string) => Promise<AIResponse["content_body"]>;
}

// 处理流式响应的通用函数
async function handleStreamResponse(
  response: Response,
  onChunk?: (chunk: string) => void
): Promise<string> {
  if (!response.ok) {
    throw new Error("Failed to get response");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    const lines = chunk.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        result += data;
        onChunk?.(data);
      }
    }
  }

  return result;
}

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (updater) =>
    set((state) => ({
      messages: state.messages.map((msg, index) =>
        index === state.messages.length - 1 ? updater(msg) : msg
      ),
    })),

  getIntent: async (content: string) => {
    const intentPrompt = INTENT_PROMPT.replace("{user_input}", content);
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: intentPrompt,
      }),
    });

    const result = await handleStreamResponse(response);
    return result.trim() as AIResponse["intent_type"];
  },

  sendChatMessage: async (content: string) => {
    const prompt = CHAT_PROMPT.replace("{user_input}", content);
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    return handleStreamResponse(response);
  },

  getRecipe: async (content: string, onChunk?: (chunk: string) => void) => {
    const prompt = RECIPE_PROMPT.replace("{user_input}", content);
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const result = await handleStreamResponse(response, onChunk);
    return JSON.parse(result) as { description: string; recipes: Recipe[] };
  },

  getFoodAvailability: async (content: string) => {
    const prompt = FOOD_AVAILABILITY_PROMPT.replace("{user_input}", content);
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const result = await handleStreamResponse(response);
    return JSON.parse(result);
  },

  sendMessage: async (
    content: string,
    setCurrentRecipe: (recipe: Recipe) => void
  ) => {
    const {
      addMessage,
      updateLastMessage,
      getIntent,
      sendChatMessage,
      getRecipe,
      getFoodAvailability,
    } = get();

    const userMessage = buildUserMessage(content);
    addMessage(userMessage);

    try {
      const intent = await getIntent(content);

      let aiResponse: AIResponse;
      switch (intent) {
        case "recipe": {
          // 创建一个初始的 recipe 消息
          const initialMessage = {
            id: `msg-${Date.now()}`,
            content: "",
            type: "recipe" as const,
            isUser: false,
            createdAt: new Date(),
            recipes: [],
          };
          addMessage(initialMessage);

          let buffer = "";
          let descriptionBuffer = "";
          let descriptionDone = false;

          // 获取菜谱数据，并实时更新消息内容
          const recipeContent = await getRecipe(content, (chunk) => {
            buffer += chunk;

            // 动态提取 description 字段内容
            if (!descriptionDone) {
              const descStart = buffer.indexOf('"description":"');
              if (descStart !== -1) {
                const descContentStart = descStart + 15;
                let descContent = "";
                for (let i = descContentStart; i < buffer.length; i++) {
                  if (buffer[i] === '"' && buffer[i - 1] !== '\\') {
                    // description 字段内容结束
                    descriptionDone = true;
                    break;
                  }
                  descContent += buffer[i];
                }
                // 只在内容有变化时更新
                if (descContent !== descriptionBuffer) {
                  descriptionBuffer = descContent;
                  updateLastMessage((msg) => ({
                    ...msg,
                    content: descriptionBuffer,
                  }));
                }
              }
            }

            // 只有能完整解析 JSON 时才渲染 recipes
            try {
              const parsed = JSON.parse(buffer);
              if (parsed.recipes) {
                updateLastMessage((msg) => ({
                  ...msg,
                  recipes: parsed.recipes,
                }));
                if (parsed.recipes[0]) {
                  setCurrentRecipe(parsed.recipes[0]);
                }
              }
              buffer = "";
            } catch {
              // 还没完整，不做任何处理
            }
          });

          aiResponse = {
            intent_type: "recipe",
            content_body: recipeContent,
          };
          break;
        }
        case "food_availability": {
          const foodAvailabilityContent = await getFoodAvailability(content);
          aiResponse = {
            intent_type: "food_availability",
            content_body: foodAvailabilityContent,
          };
          const message = buildMessageFromAIResponse(aiResponse);
          addMessage(message);
          break;
        }
        default: {
          const chatContent = await sendChatMessage(content);
          aiResponse = {
            intent_type: "chat",
            content_body: chatContent,
          };
          const message = buildMessageFromAIResponse(aiResponse);
          addMessage(message);
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
