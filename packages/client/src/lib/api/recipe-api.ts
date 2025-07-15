import { sendMessage } from "./base-api";
import { RECIPE_PROMPT } from "@/prompts/recipe-prompt";
import { BasicRecipeInfo } from "@/types/recipe";
import { ChatCompletionMessageParam } from "openai/resources";
import { RecipeInput } from "@/lib/gql/graphql";

/**
 * 根据基础菜谱信息，使用 RECIPE_PROMPT 让 AI 生成完整菜谱详情，
 * 并返回可直接用于 GraphQL createRecipe 的输入对象（RecipeInput）。
 */
export const generateRecipeDetail = async (
  basicInfo: BasicRecipeInfo,
  signal?: AbortSignal
): Promise<RecipeInput> => {
  // 准备 system prompt
  const prompt = RECIPE_PROMPT.replace("{{RECIPE_NAME}}", basicInfo.name).replace(
    "{{SERVINGS}}",
    "2人份"
  );

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: `请根据以下信息生成 "${basicInfo.name}" 的详细菜谱（JSON 格式）。`,
    },
  ];

  // 调用后端 /chat 接口获取 AI 返回
  const recipeDetail = await sendMessage({
    messages,
    systemPrompt: prompt,
    format: "json",
    signal,
  });

  // 将 AI JSON 映射到 RecipeInput
  const input: RecipeInput = {
    name: recipeDetail.name,
    description: recipeDetail.description,
    cuisineType: recipeDetail.cuisineType ?? undefined,
    mealType: recipeDetail.mealType ?? undefined,
    servings: recipeDetail.servings ?? 2,
    difficulty: (recipeDetail.difficulty ? recipeDetail.difficulty.toUpperCase() : undefined) as any,
    prepTimeApproxMin: recipeDetail.prepTimeApproxMin ?? null,
    cookTimeApproxMin: recipeDetail.cookTimeApproxMin ?? null,
    totalTimeApproxMin: recipeDetail.totalTimeApproxMin ?? null,
    costApprox: recipeDetail.costApprox ?? null,
    currency: recipeDetail.currency ?? null,
    dietaryTags: recipeDetail.dietaryTags ?? [],
    allergens: recipeDetail.allergens ?? [],
    tips: recipeDetail.tips ?? null,
    leftoverHandling: recipeDetail.leftoverHandling ?? null,
    ingredientsJson: JSON.stringify(recipeDetail.ingredients ?? []),
    stepsJson: JSON.stringify(recipeDetail.steps ?? []),
    nutrientsJson: JSON.stringify(recipeDetail.nutrients ?? {}),
    equipmentsJson: JSON.stringify(recipeDetail.equipments ?? []),
  } as RecipeInput;

  return input;
};
