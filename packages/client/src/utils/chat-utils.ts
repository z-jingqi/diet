import type { Message, Tag } from "@diet/shared";
import { ChatCompletionMessageParam } from "openai/resources";

/**
 * 增强用户消息，添加标签信息
 * @param messages 消息数组
 * @param currentTags 当前标签
 * @returns 增强后的消息数组
 */
const enhanceUserMessages = (
  messages: Message[],
  currentTags?: Tag[]
): Message[] => {
  if (!currentTags || currentTags.length === 0) {
    return messages;
  }

  // 找到最后一条用户消息
  const lastUserMessageIndex = messages
    .map((msg, index) => ({ msg, index }))
    .filter(({ msg }) => msg.isUser)
    .pop()?.index;

  if (lastUserMessageIndex === undefined) {
    return messages;
  }

  // 检查之前的用户消息，看是否已经包含了相同的饮食限制条件
  const currentTagInfo = currentTags.map((tag) => tag.aiPrompt).join("\n");

  // 从最后一条用户消息往前查找，直到找到第一个包含饮食限制条件的消息
  for (let i = lastUserMessageIndex - 1; i >= 0; i--) {
    const message = messages[i];
    if (!message.isUser) {
      continue; // 跳过AI消息
    }

    // 检查这条消息是否包含饮食限制条件
    if (message.content.includes("用户饮食限制条件：")) {
      // 提取这条消息中的饮食限制条件
      const match = message.content.match(
        /用户饮食限制条件：\n([\s\S]*?)\n\n用户问题：/
      );
      if (match) {
        const previousTagInfo = match[1];
        // 如果饮食限制条件相同，则不重复添加
        if (previousTagInfo === currentTagInfo) {
          return messages; // 直接返回原消息，不进行增强
        }
      }
      // 如果找到了包含饮食限制条件的消息，就停止查找
      break;
    }
  }

  // 创建新的消息数组，只修改最后一条用户消息
  const enhancedMessages = [...messages];
  const lastUserMessage = enhancedMessages[lastUserMessageIndex];

  const enhancedContent = `用户饮食限制条件：\n${currentTagInfo}\n\n用户问题：${lastUserMessage.content}`;

  enhancedMessages[lastUserMessageIndex] = {
    ...lastUserMessage,
    content: enhancedContent,
  };

  return enhancedMessages;
};

/**
 * 将消息转换为 AI 格式
 * @param messages 消息数组
 * @param currentTags 当前标签
 * @returns AI 格式的消息数组
 */
export const toAIMessages = (
  messages: Message[],
  currentTags?: Tag[]
): ChatCompletionMessageParam[] => {
  // 第一步：增强用户消息（添加标签信息）
  const enhancedMessages = enhanceUserMessages(messages, currentTags);

  // 第二步：转换为 AI 格式
  const result: ChatCompletionMessageParam[] = enhancedMessages.map((msg) => {
    if (msg.isUser) {
      return { role: "user", content: msg.content };
    } else {
      return { role: "assistant", content: msg.content };
    }
  });

  return result;
};

/**
 * 比较两个标签数组是否相同
 * @param tags1 第一个标签数组
 * @param tags2 第二个标签数组
 * @returns 是否相同
 */
export const areTagsEqual = (tags1: Tag[], tags2: Tag[]): boolean => {
  if (!tags1 || !tags2) {
    return false;
  }
  if (tags1.length !== tags2.length) {
    return false;
  }
  return tags1.every((tag1) => tags2.some((tag2) => tag2.id === tag1.id));
};
