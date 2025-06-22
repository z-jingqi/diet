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
} from "@shared/prompts";

// 检测消息是否包含菜谱推荐（通过特殊标记）
export const isRecipeMessage = (content: string): boolean => {
  return content.includes("<recipe_suggestions>");
};

// 提取 <recipe_suggestions> 标签内的内容
export const extractRecipeSection = (content: string): string => {
  const match = content.match(/<recipe_suggestions>([\s\S]*?)<\/recipe_suggestions>/);
  return match ? match[1] : content;
};

// 从菜谱消息中提取菜品名称
export const extractRecipeNames = (content: string): string[] => {
  const section = extractRecipeSection(content);
  const recipeNames: string[] = [];
  // 匹配 **数字. 菜品名称** 或 **菜品名称** 格式
  const boldPattern = /\*\*(?:\d+\.)?\s*([^*]+)\*\*/g;
  let match;
  while ((match = boldPattern.exec(section)) !== null) {
    recipeNames.push(match[1].trim());
  }
  return recipeNames;
};

// 从菜谱消息中提取菜品详细信息
export const extractRecipeDetails = (content: string): Array<{
  name: string;
  servings?: string;
  tools?: string;
  cost?: string;
  difficulty?: string;
  features?: string;
}> => {
  const section = extractRecipeSection(content);
  const recipes: Array<{
    name: string;
    servings?: string;
    tools?: string;
    cost?: string;
    difficulty?: string;
    features?: string;
  }> = [];
  // 匹配菜品块
  const recipeBlockPattern = /\*\*(?:\d+\.)?\s*([^*]+)\*\*([\s\S]*?)(?=\*\*(?:\d+\.)?\s*[^*]+\*\*|$)/g;
  let match;
  while ((match = recipeBlockPattern.exec(section)) !== null) {
    const recipeName = match[1].trim();
    const recipeContent = match[2];
    const recipe: {
      name: string;
      servings?: string;
      tools?: string;
      cost?: string;
      difficulty?: string;
      features?: string;
    } = { name: recipeName };
    // 提取适用人数
    const servingsMatch = recipeContent.match(/适用人数：([^\n]+)/);
    if (servingsMatch) {
      recipe.servings = servingsMatch[1].trim();
    }
    // 提取关键厨具
    const toolsMatch = recipeContent.match(/关键厨具：([^\n]+)/);
    if (toolsMatch) {
      recipe.tools = toolsMatch[1].trim();
    }
    // 提取大概花费
    const costMatch = recipeContent.match(/大概花费：([^\n]+)/);
    if (costMatch) {
      recipe.cost = costMatch[1].trim();
    }
    // 提取难度
    const difficultyMatch = recipeContent.match(/难度：([^\n]+)/);
    if (difficultyMatch) {
      recipe.difficulty = difficultyMatch[1].trim();
    }
    // 提取特点
    const featuresMatch = recipeContent.match(/特点：([^\n]+)/);
    if (featuresMatch) {
      recipe.features = featuresMatch[1].trim();
    }
    recipes.push(recipe);
  }
  return recipes;
};

// 移除菜谱标记，获取纯文本内容
export const removeRecipeMarkers = (content: string): string => {
  return content
    .replace(/<recipe_suggestions>/g, "")
    .replace(/<\/recipe_suggestions>/g, "")
    .trim();
};

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

// 发送健康建议消息（JSON）- 使用HEALTH_ADVICE_PROMPT
export const sendHealthAdviceMessage = async (
  messages: { role: string; content: string }[],
  signal?: AbortSignal
): Promise<HealthAdvice> => {
  return sendMessage(messages, HEALTH_ADVICE_PROMPT, "json", signal);
};
