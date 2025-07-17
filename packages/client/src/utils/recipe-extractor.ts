import { nanoid } from "nanoid";
import { BasicRecipeInfo } from "@/types/recipe";

/**
 * 判断文本是否包含菜谱推荐（通过粗体加序号的模式来简单检测）
 */
export const containsRecipeRecommendations = (content: string): boolean => {
  const pattern = /\*\*\s*\d+\.\s*[^*]+\*\*/;
  return pattern.test(content);
};

/**
 * 从聊天回复中提取菜谱基础信息（名称 / 人均花费 / 耗时 / 难度 / 主食材）
 * 假设每条菜谱信息严格遵循如下 6 行格式：
 * **1. 宫保鸡丁**
 * 人均花费：20-25元
 * 预计耗时：30分钟
 * 难度：简单
 * 主食材：鸡肉, 花生, 干辣椒
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

  // 使用多行正则一次性提取一个菜品块（新版，去掉人数，新增人均花费、预计耗时、主食材）
  const recipeBlockRegex = /\*\*\s*(?:\d+\.)?\s*([^*]+?)\s*\*\*\s*\n\s*人均花费：([^\n]+?)\n\s*预计耗时：([^\n]+?)\n\s*难度：([^\n]+?)\n\s*主食材：([^\n]+?)\n/gu;

  let match: RegExpExecArray | null;
  while ((match = recipeBlockRegex.exec(normalizedContent)) !== null) {
    const [, name, avgCost, duration, difficulty, mainIngredients] = match;
    results.push({
      id: nanoid(),
      name: name.replace(/<br\s*\/?\s*>/gi, "").trim(),
      avgCost: avgCost.replace(/<br\s*\/?\s*>/gi, "").trim(),
      duration: duration.replace(/<br\s*\/?\s*>/gi, "").trim(),
      difficulty: difficulty.replace(/<br\s*\/?\s*>/gi, "").trim(),
      mainIngredients: mainIngredients.replace(/<br\s*\/?\s*>/gi, "").trim(),
    });
  }

  return results;
}; 
