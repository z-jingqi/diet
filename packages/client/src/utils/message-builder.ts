import type { Message, MessageType } from "@diet/shared";
import { nanoid } from "nanoid";

/**
 * 生成随机ID
 * @returns 随机ID字符串
 */
const generateRandomId = (): string => {
  return nanoid();
};

/**
 * 从 AI 响应构建消息
 * @param response AI 响应内容
 * @param isUser 是否为用户消息
 * @returns 构建的消息对象
 */
export const buildMessage = (
  type: MessageType,
  isUser: boolean = false
): Message => {
  return {
    id: generateRandomId(),
    type,
    content: "",
    isUser,
    createdAt: new Date(),
    status: isUser ? "done" : "pending",
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
  type: "chat",
  isUser: true,
  createdAt: new Date(),
  status: "done",
});
