export type RecipeIngredient = {
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
};

export type RecipeStepMedia = {
  type: "image" | "video";
  url: string;
  caption?: string;
};

export type RecipeStep = {
  order: number;
  instruction: string;
  durationMinutes?: number;
  ingredients?: RecipeIngredient[];
  tools?: string[];
  temperature?: string;
  notes?: string;
  tips?: string[];
  media?: RecipeStepMedia[];
};

export type RecipeDifficulty = "easy" | "medium" | "hard";

export type Recipe = {
  id?: string;
  title: string;
  description?: string;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  difficulty?: RecipeDifficulty;
  tags?: string[];
  sourceUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isFavorited?: boolean;
};
