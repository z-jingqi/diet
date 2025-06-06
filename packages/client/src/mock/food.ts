import type { Food, Nutrition } from '../types/food';

// 基础营养成分数据
export const mockNutrition: Nutrition = {
  protein: 20,
  potassium: 300,
  phosphorus: 200,
  sodium: 50,
  calories: 150
};

// 食物数据
export const mockFoods: Food[] = [
  {
    name: "鸡胸肉",
    amount: "200g",
    nutrition: {
      protein: 43,
      potassium: 256,
      phosphorus: 228,
      sodium: 74,
      calories: 165
    }
  },
  {
    name: "西兰花",
    amount: "100g",
    nutrition: {
      protein: 2.8,
      potassium: 316,
      phosphorus: 66,
      sodium: 33,
      calories: 34
    }
  },
  {
    name: "糙米",
    amount: "100g",
    nutrition: {
      protein: 2.6,
      potassium: 143,
      phosphorus: 143,
      sodium: 5,
      calories: 112
    }
  }
]; 
