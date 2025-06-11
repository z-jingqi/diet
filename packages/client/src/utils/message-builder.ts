import type { Message, AIResponse } from '@shared/types/chat';
import type { Recipe } from '@shared/types/recipe';

/**
 * 生成随机ID
 * @returns 随机ID字符串
 */
const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * 从 AI 响应构建消息
 * @param response AI 响应内容
 * @param isUser 是否为用户消息
 * @returns 构建的消息对象
 */
export const buildMessageFromAIResponse = (
  response: AIResponse,
  isUser: boolean = false
): Message => {
  const baseMessage: Partial<Message> = {
    id: generateRandomId(),
    type: response.intent_type,
    isUser,
    createdAt: new Date(),
  };

  if (response.intent_type === 'recipe') {
    const content = response.content_body as { description: string; recipes: Recipe[] };
    return {
      ...baseMessage,
      content: content.description,
      recipes: content.recipes,
    } as Message;
  }

  if (response.intent_type === 'food_availability') {
    const content = response.content_body;
    return {
      ...baseMessage,
      content: JSON.stringify(content, null, 2),
      foodAvailability: content,
    } as Message;
  }

  return {
    ...baseMessage,
    content: response.content_body as string,
  } as Message;
};

/**
 * 构建用户消息
 * @param content 消息内容
 * @returns 用户消息对象
 */
export const buildUserMessage = (content: string): Message => ({
  id: generateRandomId(),
  content,
  type: 'chat',
  isUser: true,
  createdAt: new Date(),
}); 
