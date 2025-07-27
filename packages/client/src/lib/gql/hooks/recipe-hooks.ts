import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../client";
import { BasicRecipeInfo } from "@/types/recipe";
import { RECIPE_QUERY_KEYS } from "./common";
import {
  GetRecipePreferencesDocument,
  GetRecipePreferencesQuery,
  PreferenceType,
  SetRecipePreferenceDocument,
  SetRecipePreferenceMutation,
  SetRecipePreferenceMutationVariables,
  GetRecipeDocument,
  GetRecipeQuery,
  UpdateRecipeDocument,
  UpdateRecipeMutation,
  UpdateRecipeMutationVariables,
  RecipeInput,
  CreateRecipeDocument,
  CreateRecipeMutation,
  CreateRecipeMutationVariables,
} from "../graphql";

import { generateRecipeDetail } from "@/lib/api/recipe-api";

/**
 * 查询用户标记的菜谱喜好
 */
export const useRecipePreferences = (enabled = true) => {
  return useQuery({
    queryKey: RECIPE_QUERY_KEYS.RECIPE_PREFERENCES,
    queryFn: async () => {
      try {
        const { myRecipePreferences } =
          await graphqlClient.request<GetRecipePreferencesQuery>(
            GetRecipePreferencesDocument,
          );
        return myRecipePreferences || [];
      } catch (error) {
        console.error("获取菜谱喜好失败:", error);
        return [];
      }
    },
    enabled,
  });
};

/**
 * 设置菜谱喜好（不喜欢）
 * 注：前端已简化为只标记不喜欢的菜谱，喜欢的菜谱通过生成详情来表示
 */
export const useSetRecipePreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recipe,
      preference,
    }: {
      recipe: BasicRecipeInfo;
      preference: PreferenceType;
    }) => {
      const response = await graphqlClient.request<
        SetRecipePreferenceMutation,
        SetRecipePreferenceMutationVariables
      >(SetRecipePreferenceDocument, {
        input: {
          recipeName: recipe.name,
          recipeBasicInfo: JSON.stringify(recipe),
          preference,
        },
      });

      return response.setRecipePreference;
    },
    onSuccess: () => {
      // 成功后刷新菜谱喜好列表
      queryClient.invalidateQueries({
        queryKey: RECIPE_QUERY_KEYS.RECIPE_PREFERENCES,
      });
    },
  });
};

/**
 * 检查菜谱是否已经被标记不喜欢
 */
export const useRecipePreferenceStatus = (recipeName: string) => {
  const { data: preferences, isLoading } = useRecipePreferences();

  if (isLoading || !preferences) {
    return { isDisliked: false, loading: true };
  }

  const preference = preferences.find((p) => p.recipeName === recipeName);

  return {
    isDisliked: preference?.preference === PreferenceType.Dislike,
    loading: false,
  };
};

/**
 * 生成菜谱详情
 */
export const useGenerateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (basicInfo: BasicRecipeInfo) => {
      // 1. 调用 AI 生成完整菜谱详情并映射为 RecipeInput
      const recipeInput: RecipeInput = await generateRecipeDetail(basicInfo);

      // 2. 调用 GraphQL createRecipe 创建记录
      const { createRecipe } = await graphqlClient.request<
        CreateRecipeMutation,
        CreateRecipeMutationVariables
      >(CreateRecipeDocument, { input: recipeInput });

      return createRecipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECIPE_QUERY_KEYS.MY_RECIPES });
    },
  });
};

/**
 * 获取菜谱详情
 */
export const useRecipeDetail = (id: string) => {
  return useQuery({
    queryKey: RECIPE_QUERY_KEYS.RECIPE(id),
    queryFn: async () => {
      const { recipe } = await graphqlClient.request<GetRecipeQuery>(
        GetRecipeDocument,
        { id },
      );
      return recipe;
    },
    enabled: !!id,
  });
};

/**
 * 更新菜谱详情
 */
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: RecipeInput }) => {
      const { updateRecipe } = await graphqlClient.request<
        UpdateRecipeMutation,
        UpdateRecipeMutationVariables
      >(UpdateRecipeDocument, { id, input });
      return updateRecipe;
    },
    onSuccess: () => {
      // 更新成功后刷新缓存数据
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
      queryClient.invalidateQueries({ queryKey: RECIPE_QUERY_KEYS.MY_RECIPES });
    },
  });
};
