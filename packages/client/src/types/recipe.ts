import type { Nutrition } from './food';

export interface RecipeIngredient {
  name: string;
  amount: string;
  nutrition?: Nutrition;
}

export interface RecipeStep {
  order: number;
  description: string;
  tips?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition: {
    totalProtein: number;    // g
    totalPotassium: number;  // mg
    totalPhosphorus: number; // mg
    totalSodium: number;     // mg
    totalCalories: number;   // kcal
  };
  dietNote: string;
  tags: string[];
  difficulty: '简单' | '中等' | '困难';
  cookingTime: string;
  servings: number;
} 
