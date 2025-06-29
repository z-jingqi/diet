import type { Message } from "@diet/shared";

// 生成会话标题：取第一条用户消息前 20 个字符
export const generateSessionTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find((m) => m.isUser);
  if (!firstUserMessage || !firstUserMessage.content) {
    return "新对话";
  }
  const maxLength = 20;
  const content = firstUserMessage.content.trim();
  return content.length <= maxLength
    ? content
    : content.substring(0, maxLength) + "...";
};
