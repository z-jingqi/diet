import { useState } from "react";
import { RecipeDetail } from "@diet/shared";
import useRecipeStore from "@/store/recipe-store";

export const useRecipeInteractions = () => {
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [dislikedRecipes, setDislikedRecipes] = useState<Set<string>>(new Set());
  const [generatingRecipes, setGeneratingRecipes] = useState<Set<string>>(new Set());
  const { generateRecipe } = useRecipeStore();

  const handleLike = (recipeName: string) => {
    setLikedRecipes((prev) => {
      const newSet = new Set(prev);
      newSet.add(recipeName);
      return newSet;
    });
    setDislikedRecipes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(recipeName);
      return newSet;
    });
  };

  const handleDislike = (recipeName: string) => {
    setDislikedRecipes((prev) => {
      const newSet = new Set(prev);
      newSet.add(recipeName);
      return newSet;
    });
    setLikedRecipes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(recipeName);
      return newSet;
    });
  };

  const handleGenerateRecipe = async (
    recipeDetail: RecipeDetail,
    updateRecipeDetail: (recipeId: string, updates: Partial<RecipeDetail>) => void
  ) => {
    setGeneratingRecipes((prev) => {
      const newSet = new Set(prev);
      newSet.add(recipeDetail.id);
      return newSet;
    });

    try {
      const recipe = await generateRecipe(recipeDetail);
      // 更新菜谱详情，添加生成时间和菜谱ID
      updateRecipeDetail(recipeDetail.id, {
        generatedAt: new Date(),
        recipeId: recipe.id, // 使用生成的菜谱ID
      });
    } catch (error) {
      console.error("Failed to generate recipe:", error);
    } finally {
      setGeneratingRecipes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recipeDetail.id);
        return newSet;
      });
    }
  };

  return {
    likedRecipes,
    dislikedRecipes,
    generatingRecipes,
    handleLike,
    handleDislike,
    handleGenerateRecipe,
  };
}; 