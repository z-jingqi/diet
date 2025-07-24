import { useMemo } from "react";
import { ChatMessage, MessageStatus, MessageType } from "@/lib/gql/graphql";
import { extractBasicRecipeInfos } from "@/utils/recipe-extractor";
import { BasicRecipeInfo } from "@/types/recipe";

/**
 * 获取所有菜谱信息，按名称去重
 * @param messages 聊天消息列表
 * @returns 去重后的菜谱列表
 */
export const useAllRecipes = (messages: ChatMessage[]): BasicRecipeInfo[] => {
  return useMemo(() => {
    const recipesMap = new Map<string, BasicRecipeInfo>();
    
    messages.forEach((message) => {
      if (message.type === MessageType.Recipe && message.status === MessageStatus.Done) {
        const messageRecipes = extractBasicRecipeInfos(message.content || "");
        messageRecipes.forEach((recipe) => {
          // 使用菜谱名称作为key进行去重
          recipesMap.set(recipe.name, recipe);
        });
      }
    });
    
    return Array.from(recipesMap.values());
  }, [messages]);
}; 