import type { Message } from "@shared/types/chat";
import type { Tag } from "@shared/schemas";

/**
 * 将消息转换为 AI 格式
 * @param messages 消息数组
 * @param currentTags 当前标签
 * @param tagsChanged 标签是否发生变化
 * @returns AI 格式的消息数组
 */
export const toAIMessages = (messages: Message[], currentTags?: Tag[], tagsChanged?: boolean): { role: string; content: string }[] => {
  const result: { role: string; content: string }[] = [];

  // 如果标签发生变化且有标签，在第一条用户消息中添加标签信息
  let tagInfoAdded = false;

  for (const msg of messages) {
    if (msg.isUser) {
      // 对于第一条用户消息，如果有标签变化，添加标签信息
      if (tagsChanged && currentTags && currentTags.length > 0 && !tagInfoAdded) {
        const tagInfo = currentTags.map((tag) => tag.aiPrompt).join("\n");
        const enhancedContent = `用户饮食限制条件：\n${tagInfo}\n\n用户问题：${msg.content}`;
        result.push({ role: "user", content: enhancedContent });
        tagInfoAdded = true;
      } else {
        // 用户消息保持原样
        result.push({ role: "user", content: msg.content });
      }
    } else {
      // assistant 消息：如果是 recipe/health_advice，序列化为字符串
      if (msg.type === "recipe" && msg.recipes) {
        result.push({
          role: "assistant",
          content: `以下是推荐菜谱数据：\n${JSON.stringify({ description: msg.content, recipes: msg.recipes }, null, 2)}`,
        });
      } else if (msg.type === "health_advice" && msg.healthAdvice) {
        result.push({
          role: "assistant",
          content: `以下是健康建议数据：\n${JSON.stringify(msg.healthAdvice, null, 2)}`,
        });
      } else {
        // 普通 assistant 消息
        result.push({ role: "assistant", content: msg.content });
      }
    }
  }

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
