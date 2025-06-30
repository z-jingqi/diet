import { ChatMessage, MessageRole, MessageStatus, MessageType } from "@/lib/gql/graphql";
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
  role: MessageRole = MessageRole.Assistant
): ChatMessage => {
  return {
    id: generateRandomId(),
    type,
    content: "",
    role,
    createdAt: new Date(),
    status: role === MessageRole.User ? MessageStatus.Done : MessageStatus.Pending,
  } as ChatMessage;
};

/**
 * 构建用户消息
 * @param content 消息内容
 * @returns 用户消息对象
 */
export const buildUserMessage = (content: string): ChatMessage => ({
  id: generateRandomId(),
  content,
  type: MessageType.Chat,
  role: MessageRole.User,
  createdAt: new Date(),
  status: MessageStatus.Done,
});
