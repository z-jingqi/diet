import { useState } from "react";
import { RecipeDetail } from "@diet/shared";
import useRecipeStore from "@/store/recipe-store";

export const useRecipeInteractions = () => {
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [dislikedRecipes, setDislikedRecipes] = useState<Set<string>>(
    new Set()
  );
  const [generatingRecipes, setGeneratingRecipes] = useState<Set<string>>(
    new Set()
  );
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

  // TODO: 需要把生成的菜谱和菜谱详情关联起来
  const handleGenerateRecipe = async (recipeDetail: RecipeDetail) => {
    setGeneratingRecipes((prev) => {
      const newSet = new Set(prev);
      newSet.add(recipeDetail.id);
      return newSet;
    });

    try {
      const recipe = await generateRecipe(recipeDetail);
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
