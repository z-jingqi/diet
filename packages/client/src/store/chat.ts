import { create } from 'zustand';
import type { Message, AIResponse } from '@/types/chat';
import type { Recipe } from '@/types/recipe';
import { buildMessageFromAIResponse, buildUserMessage } from '@/utils/message-builder';
import { INTENT_PROMPT, CHAT_PROMPT, RECIPE_PROMPT, FOOD_AVAILABILITY_PROMPT } from '@/prompts/chat-prompt';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  sendMessage: (content: string, setCurrentRecipe: (recipe: Recipe) => void) => Promise<void>;
  getIntent: (content: string) => Promise<AIResponse["intent_type"]>;
  sendChatMessage: (content: string) => Promise<string>;
  getRecipe: (content: string) => Promise<{ description: string; recipes: Recipe[] }>;
  getFoodAvailability: (content: string) => Promise<AIResponse["content_body"]>;
}

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ isLoading: loading }),

  getIntent: async (content: string) => {
    const intentPrompt = INTENT_PROMPT.replace("{user_input}", content);
    const intentResponse = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: intentPrompt,
      }),
    });

    if (!intentResponse.ok) {
      throw new Error("Failed to get intent");
    }

    const intentResult = await intentResponse.text();
    return intentResult.trim() as AIResponse["intent_type"];
  },

  sendChatMessage: async (content: string) => {
    const prompt = CHAT_PROMPT.replace("{user_input}", content);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response");
    }

    return await response.text();
  },

  getRecipe: async (content: string) => {
    const prompt = RECIPE_PROMPT.replace("{user_input}", content);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get recipe");
    }

    const result = await response.text();
    return JSON.parse(result) as { description: string; recipes: Recipe[] };
  },

  getFoodAvailability: async (content: string) => {
    const prompt = FOOD_AVAILABILITY_PROMPT.replace("{user_input}", content);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get food availability");
    }

    const result = await response.text();
    return JSON.parse(result);
  },

  sendMessage: async (content: string, setCurrentRecipe: (recipe: Recipe) => void) => {
    const { addMessage, setLoading, getIntent, sendChatMessage, getRecipe, getFoodAvailability } = get();

    const userMessage = buildUserMessage(content);
    addMessage(userMessage);
    setLoading(true);

    try {
      const intent = await getIntent(content);

      let aiResponse: AIResponse;
      switch (intent) {
        case "recipe": {
          const recipeContent = await getRecipe(content);
          aiResponse = {
            intent_type: "recipe",
            content_body: recipeContent,
          };
          if (recipeContent.recipes?.[0]) {
            setCurrentRecipe(recipeContent.recipes[0]);
          }
          break;
        }
        case "food_availability": {
          const foodAvailabilityContent = await getFoodAvailability(content);
          aiResponse = {
            intent_type: "food_availability",
            content_body: foodAvailabilityContent,
          };
          break;
        }
        default: {
          const chatContent = await sendChatMessage(content);
          aiResponse = {
            intent_type: "chat",
            content_body: chatContent,
          };
        }
      }

      const message = buildMessageFromAIResponse(aiResponse);
      addMessage(message);
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        id: `error-${Date.now()}`,
        content: "抱歉，我遇到了一些问题，请稍后再试。",
        type: "chat",
        isUser: false,
        createdAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  },
}));

export default useChatStore; 
