import { nanoid } from "nanoid";

/**
 * 聊天回复中推荐菜品的基础信息
 */
export interface BasicRecipeInfo {
  id: string;
  /** 菜品名称 */
  name: string;
  /** 适用人数原始字符串，例如 "2-3人份" */
  servings: string;
  /** 花费原始字符串，例如 "15-25元" */
  cost: string;
  /** 难度，例如 "简单" | "中等" | "困难" */
  difficulty: string;
}

/**
 * 判断文本是否包含菜谱推荐（通过粗体加序号的模式来简单检测）
 */
export const containsRecipeRecommendations = (content: string): boolean => {
  const pattern = /\*\*\s*\d+\.\s*[^*]+\*\*/;
  return pattern.test(content);
};

/**
 * 从聊天回复中提取菜谱基础信息（名称 / 人数 / 花费 / 难度）
 * 假设每条菜谱信息严格遵循如下 5 行格式：
 * **1. 宫保鸡丁**
 * 适用人数：2-3人份
 * 大概花费：20-25元
 * 难度：简单
 * 特点：酸甜微辣，口感鲜嫩
 */
export const extractBasicRecipeInfos = (
  content: string
): BasicRecipeInfo[] => {
  const results: BasicRecipeInfo[] = [];

  if (!content) {
    return results;
  }

  // 将 HTML 换行标签统一替换为换行符，方便后续正则匹配
  const normalizedContent = content.replace(/<br\s*\/?\s*>/gi, "\n");

  // 使用多行正则一次性提取一个菜品块
  const recipeBlockRegex = /\*\*\s*(?:\d+\.)?\s*([^*]+?)\s*\*\*\s*\n\s*适用人数：([^\n]+?)\n\s*大概花费：([^\n]+?)\n\s*难度：([^\n]+?)\n/gu;

  let match: RegExpExecArray | null;
  while ((match = recipeBlockRegex.exec(normalizedContent)) !== null) {
    const [, name, servings, cost, difficulty] = match;
    results.push({
      id: nanoid(),
      name: name.replace(/<br\s*\/?\s*>/gi, "").trim(),
      servings: servings.replace(/<br\s*\/?\s*>/gi, "").trim(),
      cost: cost.replace(/<br\s*\/?\s*>/gi, "").trim(),
      difficulty: difficulty.replace(/<br\s*\/?\s*>/gi, "").trim(),
    });
  }

  return results;
}; 
