import { create } from "zustand";
import { generateRecipeFromDescription } from "@/lib/api/recipe-api";
import type { RecipeDetail, GeneratedRecipe } from "@diet/shared";

interface RecipeState {
  currentRecipe: GeneratedRecipe | null;
  recipes: GeneratedRecipe[];
  setCurrentRecipe: (recipe: GeneratedRecipe | null) => void;
  // 菜谱生成功能
  generateRecipe: (recipeDetail: RecipeDetail) => Promise<GeneratedRecipe>;
  // 根据ID获取菜谱
  getRecipeById: (id: string) => GeneratedRecipe | null;
  // 添加菜谱到数组
  addRecipe: (recipe: GeneratedRecipe) => void;
  // 设置当前菜谱（通过ID）
  setCurrentRecipeById: (id: string) => void;
}

const useRecipeStore = create<RecipeState>((set, get) => ({
  currentRecipe: null,
  recipes: [],

  setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),

  generateRecipe: async (recipeDetail: RecipeDetail) => {
    const recipe = await generateRecipeFromDescription(recipeDetail);
    // 生成菜谱后自动添加到数组中
    set((state) => ({
      recipes: [...state.recipes, recipe],
      currentRecipe: recipe,
    }));
    return recipe;
  },

  getRecipeById: (id: string) => {
    const { recipes } = get();
    return recipes.find(recipe => recipe.id === id) || null;
  },

  addRecipe: (recipe: GeneratedRecipe) => {
    set((state) => ({
      recipes: [...state.recipes, recipe],
    }));
  },

  setCurrentRecipeById: (id: string) => {
    const { getRecipeById } = get();
    const recipe = getRecipeById(id);
    set({ currentRecipe: recipe });
  },
}));

export default useRecipeStore;
