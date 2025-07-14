import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../client";
import { BasicRecipeInfo } from "@/types/recipe";
import {
  GetRecipePreferencesDocument,
  GetRecipePreferencesQuery,
  PreferenceType,
  SetRecipePreferenceDocument,
  SetRecipePreferenceMutation,
  SetRecipePreferenceMutationVariables,
  GenerateRecipeDocument,
  GenerateRecipeMutation,
  GenerateRecipeMutationVariables,
  GetRecipeDocument,
  GetRecipeQuery
} from "../graphql";
import { useNavigate } from "@tanstack/react-router";

/**
 * 查询用户标记的菜谱喜好
 */
export const useRecipePreferences = () => {
  return useQuery({
    queryKey: ["recipePreferences"],
    queryFn: async () => {
      try {
        const { myRecipePreferences } = await graphqlClient.request<GetRecipePreferencesQuery>(
          GetRecipePreferencesDocument
        );
        return myRecipePreferences || [];
      } catch (error) {
        console.error("获取菜谱喜好失败:", error);
        return [];
      }
    },
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
      preference
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
          preference
        }
      });
      
      return response.setRecipePreference;
    },
    onSuccess: () => {
      // 成功后刷新菜谱喜好列表
      queryClient.invalidateQueries({ queryKey: ["recipePreferences"] });
    }
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
  
  const preference = preferences.find(p => p.recipeName === recipeName);
  
  return {
    isDisliked: preference?.preference === PreferenceType.Dislike,
    loading: false
  };
};

/**
 * 生成菜谱详情
 */
export const useGenerateRecipe = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async (recipe: BasicRecipeInfo) => {
      const response = await graphqlClient.request<
        GenerateRecipeMutation,
        GenerateRecipeMutationVariables
      >(GenerateRecipeDocument, {
        input: {
          recipeName: recipe.name,
          recipeBasicInfo: JSON.stringify(recipe),
          servings: 2
        }
      });
      
      return response.generateRecipe;
    },
    onSuccess: (recipe) => {
      // 成功后刷新菜谱列表
      queryClient.invalidateQueries({ queryKey: ["myRecipes"] });
      
      // 导航到菜谱详情页
      if (recipe?.id) {
        navigate({ to: `/recipe/$id`, params: { id: recipe.id } });
      }
    }
  });
};

/**
 * 获取菜谱详情
 */
export const useRecipeDetail = (id: string) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const { recipe } = await graphqlClient.request<GetRecipeQuery>(
        GetRecipeDocument,
        { id }
      );
      return recipe;
    },
    enabled: !!id
  });
}; 