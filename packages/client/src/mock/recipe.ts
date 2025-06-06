import type { Recipe } from "../types/recipe";
import { mockFoods } from "./food";

// 菜谱数据
export const mockRecipes: Recipe[] = [
  {
    id: "recipe-1",
    name: "低钠鸡胸肉沙拉",
    ingredients: [
      {
        name: "鸡胸肉",
        amount: "200g",
        nutrition: mockFoods[0].nutrition,
        order: 1,
        purpose: "主要蛋白质来源",
      },
      {
        name: "西兰花",
        amount: "100g",
        nutrition: mockFoods[1].nutrition,
        order: 2,
        purpose: "提供膳食纤维和维生素",
      },
    ],
    steps: [
      {
        order: 1,
        description: "将鸡胸肉切成小块，用少量盐腌制10分钟",
        time: 600,
        tips: "可以用柠檬汁代替盐来调味",
      },
      {
        order: 2,
        description: "西兰花洗净切小朵，焯水2分钟",
        time: 120,
        tips: "焯水时加入少量盐保持颜色",
      },
    ],
    nutrition: {
      totalProtein: 45.8,
      totalPotassium: 572,
      totalPhosphorus: 294,
      totalSodium: 107,
      totalCalories: 199,
    },
    dietNote: "适合低钠饮食人群",
    tags: ["低钠", "高蛋白", "减脂"],
    difficulty: "简单",
    cookingTime: "20分钟",
    servings: 2,
  },
  {
    id: "recipe-2",
    name: "低磷糙米粥",
    ingredients: [
      {
        name: "糙米",
        amount: "100g",
        nutrition: mockFoods[2].nutrition,
        order: 1,
        purpose: "主要碳水化合物来源",
      },
      {
        name: "鸡胸肉",
        amount: "100g",
        nutrition: mockFoods[0].nutrition,
        order: 2,
        purpose: "提供优质蛋白质",
      },
    ],
    steps: [
      {
        order: 1,
        description: "糙米提前浸泡2小时",
        time: 7200,
        tips: "浸泡可以缩短煮制时间",
      },
      {
        order: 2,
        description: "鸡胸肉切丁，用少量盐腌制",
        time: 600,
        tips: "可以用姜丝去腥",
      },
      {
        order: 3,
        description: "将糙米和鸡胸肉一起煮至粥状",
        time: 1800,
        tips: "期间需要经常搅拌防止粘锅",
      },
    ],
    nutrition: {
      totalProtein: 25.6,
      totalPotassium: 399,
      totalPhosphorus: 371,
      totalSodium: 79,
      totalCalories: 277,
    },
    dietNote: "适合需要控制磷摄入的人群",
    tags: ["低磷", "易消化", "营养均衡"],
    difficulty: "简单",
    cookingTime: "2小时40分钟",
    servings: 2,
  },
  {
    id: "recipe-3",
    name: "高蛋白西兰花炒鸡胸",
    ingredients: [
      {
        name: "鸡胸肉",
        amount: "300g",
        nutrition: mockFoods[0].nutrition,
        order: 1,
        purpose: "主要蛋白质来源",
      },
      {
        name: "西兰花",
        amount: "200g",
        nutrition: mockFoods[1].nutrition,
        order: 2,
        purpose: "提供维生素和膳食纤维",
      },
      {
        name: "糙米",
        amount: "150g",
        nutrition: mockFoods[2].nutrition,
        order: 3,
        purpose: "提供碳水化合物",
      },
    ],
    steps: [
      {
        order: 1,
        description: "鸡胸肉切块，用少量盐和黑胡椒腌制",
        time: 900,
        tips: "可以加入少量料酒去腥",
      },
      {
        order: 2,
        description: "西兰花洗净切小朵，焯水1分钟",
        time: 60,
        tips: "焯水时加入少量盐保持颜色",
      },
      {
        order: 3,
        description: "糙米提前浸泡2小时后煮熟",
        time: 7200,
        tips: "可以加入少量橄榄油增加口感",
      },
      {
        order: 4,
        description: "热锅下油，爆香蒜末，加入鸡胸肉翻炒",
        time: 300,
        tips: "保持中火，避免鸡肉变柴",
      },
      {
        order: 5,
        description: "加入西兰花继续翻炒2分钟",
        time: 120,
        tips: "可以加入少量蚝油提鲜",
      },
    ],
    nutrition: {
      totalProtein: 89.4,
      totalPotassium: 888,
      totalPhosphorus: 657,
      totalSodium: 181,
      totalCalories: 511,
    },
    dietNote: "适合需要补充蛋白质的人群",
    tags: ["高蛋白", "营养均衡", "减脂"],
    difficulty: "中等",
    cookingTime: "2小时30分钟",
    servings: 3,
  },
];
