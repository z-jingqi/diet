import { create } from "zustand";
import type { Recipe } from "@shared/types/recipe";

interface RecipeState {
  currentRecipe: Recipe | null;
  setCurrentRecipe: (recipe: Recipe | null) => void;
}

const useRecipeStore = create<RecipeState>((set) => ({
  currentRecipe: null,
  setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
}));

export default useRecipeStore; 
