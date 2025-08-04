import { useMemo } from "react";
import { BasicRecipeInfo } from "@/types/recipe";
import { SortConfig } from "@/components/chat/message-bubbles/recipe-sort/RecipeSortToolbar";
import { useRecipeGenerationStatus } from "@/hooks";
import { useMyRecipesQuery } from "@/lib/gql/graphql";
import { graphqlClient } from "@/lib/gql/client";

/**
 * 菜谱排序hook
 */
export const useRecipeSort = (
  recipes: BasicRecipeInfo[],
  sortConfig: SortConfig,
) => {
  const { isGenerating } = useRecipeGenerationStatus();
  const { data: myRecipesData } = useMyRecipesQuery(graphqlClient, {});

  const sortedRecipes = useMemo(() => {
    if (!recipes.length) return recipes;

    // 创建副本进行排序
    const sorted = [...recipes];

    // 按价格排序
    if (sortConfig.price !== "default") {
      sorted.sort((a, b) => {
        const priceA = extractMinPrice(a.avgCost);
        const priceB = extractMinPrice(b.avgCost);

        if (sortConfig.price === "asc") {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      });
    }

    // 按时间排序
    if (sortConfig.time !== "default") {
      sorted.sort((a, b) => {
        const timeA = extractMinutes(a.duration);
        const timeB = extractMinutes(b.duration);

        if (sortConfig.time === "asc") {
          return timeA - timeB;
        } else {
          return timeB - timeA;
        }
      });
    }

    // 按难度排序
    if (sortConfig.difficulty !== "default") {
      const difficultyOrder = { 简单: 1, 中等: 2, 困难: 3 };
      sorted.sort((a, b) => {
        const difficultyA =
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 2;
        const difficultyB =
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 2;

        if (sortConfig.difficulty === "asc") {
          return difficultyA - difficultyB;
        } else {
          return difficultyB - difficultyA;
        }
      });
    }

    // 按生成状态排序
    if (sortConfig.status !== "default") {
      sorted.sort((a, b) => {
        const statusA = getRecipeStatus(
          a.name,
          isGenerating,
          myRecipesData?.myRecipes || [],
        );
        const statusB = getRecipeStatus(
          b.name,
          isGenerating,
          myRecipesData?.myRecipes || [],
        );

        const statusOrder = { 未生成: 1, 生成中: 2, 已生成: 3 };
        const orderA = statusOrder[statusA as keyof typeof statusOrder] || 1;
        const orderB = statusOrder[statusB as keyof typeof statusOrder] || 1;

        if (sortConfig.status === "asc") {
          return orderA - orderB;
        } else {
          return orderB - orderA;
        }
      });
    }

    return sorted;
  }, [recipes, sortConfig, isGenerating, myRecipesData?.myRecipes]);

  return sortedRecipes;
};

/**
 * 提取价格中的最低价格
 */
const extractMinPrice = (priceStr: string): number => {
  const match = priceStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * 提取时间中的分钟数
 */
const extractMinutes = (timeStr: string): number => {
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * 获取菜谱的生成状态
 */
const getRecipeStatus = (
  recipeName: string,
  isGenerating: (name: string) => boolean,
  myRecipes?: any[],
): "未生成" | "生成中" | "已生成" => {
  // 检查是否已生成
  const existingRecipe = myRecipes?.find((r) => r?.name === recipeName);
  if (existingRecipe) {
    return "已生成";
  }

  // 检查是否正在生成
  if (isGenerating(recipeName)) {
    return "生成中";
  }

  return "未生成";
};
