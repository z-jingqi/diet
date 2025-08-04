import { CuisineType, MealType, Difficulty } from "@/lib/gql/graphql";

// 菜系类型中文映射
export const cuisineTypeLabels: Record<CuisineType, string> = {
  [CuisineType.Chinese]: "中餐",
  [CuisineType.French]: "法餐",
  [CuisineType.Indian]: "印度菜",
  [CuisineType.Italian]: "意大利菜",
  [CuisineType.Japanese]: "日餐",
  [CuisineType.Korean]: "韩餐",
  [CuisineType.Mexican]: "墨西哥菜",
  [CuisineType.Other]: "其他",
  [CuisineType.Thai]: "泰国菜",
  [CuisineType.Western]: "西餐",
};

// 餐次类型中文映射
export const mealTypeLabels: Record<MealType, string> = {
  [MealType.Breakfast]: "早餐",
  [MealType.Dessert]: "甜点",
  [MealType.Dinner]: "晚餐",
  [MealType.Drink]: "饮品",
  [MealType.Lunch]: "午餐",
  [MealType.Other]: "其他",
  [MealType.Snack]: "零食",
};

// 难度中文映射
export const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.Easy]: "简单",
  [Difficulty.Medium]: "中等",
  [Difficulty.Hard]: "困难",
};
