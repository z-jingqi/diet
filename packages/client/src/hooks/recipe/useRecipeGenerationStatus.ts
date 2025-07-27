import { useState, useCallback } from "react";
import { BasicRecipeInfo } from "@/types/recipe";

// 全局状态存储，用于在组件间共享生成状态
const generationStatusMap = new Map<string, boolean>();

/**
 * 管理菜谱生成状态的hook
 * 确保状态在弹窗关闭后仍然保持
 */
export const useRecipeGenerationStatus = () => {
  const [localStatusMap, setLocalStatusMap] =
    useState<Map<string, boolean>>(generationStatusMap);

  // 设置菜谱生成状态
  const setGenerating = useCallback(
    (recipeName: string, isGenerating: boolean) => {
      generationStatusMap.set(recipeName, isGenerating);
      setLocalStatusMap(new Map(generationStatusMap));
    },
    [],
  );

  // 获取菜谱生成状态
  const isGenerating = useCallback((recipeName: string): boolean => {
    return generationStatusMap.get(recipeName) || false;
  }, []);

  // 批量设置多个菜谱的生成状态
  const setGeneratingMultiple = useCallback(
    (recipes: BasicRecipeInfo[], isGenerating: boolean) => {
      recipes.forEach((recipe) => {
        generationStatusMap.set(recipe.name, isGenerating);
      });
      setLocalStatusMap(new Map(generationStatusMap));
    },
    [],
  );

  // 清除所有生成状态
  const clearAllStatus = useCallback(() => {
    generationStatusMap.clear();
    setLocalStatusMap(new Map());
  }, []);

  return {
    isGenerating,
    setGenerating,
    setGeneratingMultiple,
    clearAllStatus,
  };
};
