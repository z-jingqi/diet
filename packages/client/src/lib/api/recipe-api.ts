import { sendMessage } from "./base-api";
import {
  RECIPE_PROMPT,
  Recipe,
  GeneratedRecipe,
  RecipeDetail,
} from "@diet/shared";
import { nanoid } from "nanoid";
import { ChatCompletionMessageParam } from "openai/resources";

// 根据菜谱描述生成详细菜谱（直接接受 RecipeDetail 类型参数）
export const generateRecipeFromDescription = async (
  recipeDetail: RecipeDetail,
  signal?: AbortSignal
): Promise<GeneratedRecipe> => {
  // 替换 prompt 中的占位符
  const prompt = RECIPE_PROMPT.replace(
    "{{RECIPE_NAME}}",
    recipeDetail.name
  ).replace("{{SERVINGS}}", recipeDetail.servings || "2人份");

  const messages = [
    {
      role: "user",
      content: `请生成"${recipeDetail.name}"的详细菜谱，适用${recipeDetail.servings || "2人份"}。`,
    },
  ] as ChatCompletionMessageParam[];

  const recipe: Recipe = await sendMessage({
    messages,
    systemPrompt: prompt,
    format: "json",
    signal,
  });
  // 返回时生成新的唯一 id
  return { ...recipe, id: nanoid() };
};
