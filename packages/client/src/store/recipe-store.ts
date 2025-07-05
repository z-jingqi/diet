import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { generateRecipeFromDescription } from "@/lib/api/recipe-api";
import type { RecipeDetail, GeneratedRecipe } from "@diet/shared";

// 1. 定义状态接口
interface RecipeState {
  currentRecipe: GeneratedRecipe | null;
  recipes: GeneratedRecipe[];
}

// 2. 定义行为接口
interface RecipeActions {
  // 设置当前菜谱
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

// 3. 合并完整的Store类型
export type RecipeStore = RecipeState & RecipeActions;

// 4. 初始状态
const initialState: RecipeState = {
  currentRecipe: null,
  recipes: [],
};

// 5. 创建行为工厂函数 - 提供静态引用点
const createRecipeActions = (set: any, get: any): RecipeActions => ({
  setCurrentRecipe: (recipe: GeneratedRecipe | null) =>
    set({ currentRecipe: recipe }),

  generateRecipe: async (recipeDetail: RecipeDetail) => {
    const recipe = await generateRecipeFromDescription(recipeDetail);
    // 生成菜谱后自动添加到数组中
    set((state: RecipeState) => ({
      recipes: [...state.recipes, recipe],
      currentRecipe: recipe,
    }));
    return recipe;
  },

  getRecipeById: (id: string) => {
    const { recipes } = get();
    return recipes.find((recipe: GeneratedRecipe) => recipe.id === id) || null;
  },

  addRecipe: (recipe: GeneratedRecipe) => {
    set((state: RecipeState) => ({
      recipes: [...state.recipes, recipe],
    }));
  },

  setCurrentRecipeById: (id: string) => {
    const { getRecipeById } = get();
    const recipe = getRecipeById(id);
    set({ currentRecipe: recipe });
  },
});

// 6. 创建选择器 - 提供更好的性能和引用追踪
export const recipeSelectors = {
  // 状态选择器
  currentRecipe: (state: RecipeStore) => state.currentRecipe,
  recipes: (state: RecipeStore) => state.recipes,

  // 行为选择器
  setCurrentRecipe: (state: RecipeStore) => state.setCurrentRecipe,
  generateRecipe: (state: RecipeStore) => state.generateRecipe,
  getRecipeById: (state: RecipeStore) => state.getRecipeById,
  addRecipe: (state: RecipeStore) => state.addRecipe,
  setCurrentRecipeById: (state: RecipeStore) => state.setCurrentRecipeById,
};

// 7. 创建自定义Hook - 提供更好的封装和模块化
export const useRecipe = () => {
  const currentRecipe = useRecipeStore(recipeSelectors.currentRecipe);
  const recipes = useRecipeStore(recipeSelectors.recipes);

  const setCurrentRecipe = useRecipeStore(recipeSelectors.setCurrentRecipe);
  const generateRecipe = useRecipeStore(recipeSelectors.generateRecipe);
  const getRecipeById = useRecipeStore(recipeSelectors.getRecipeById);
  const addRecipe = useRecipeStore(recipeSelectors.addRecipe);
  const setCurrentRecipeById = useRecipeStore(
    recipeSelectors.setCurrentRecipeById
  );

  return {
    // 状态
    currentRecipe,
    recipes,

    // 行为
    setCurrentRecipe,
    generateRecipe,
    getRecipeById,
    addRecipe,
    setCurrentRecipeById,
  };
};

// 8. 创建Store
const useRecipeStore = create<RecipeStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      ...createRecipeActions(set, get),
    }),
    {
      name: "recipe-store",
    }
  )
);

export default useRecipeStore;
