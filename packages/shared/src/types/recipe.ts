import type { Food } from './food';

/**
 * 菜谱中的食材信息
 */
export interface RecipeIngredient extends Food {
  /** 食材在菜谱中的序号 */
  order: number;
  /** 食材在菜谱中的用途说明 */
  purpose?: string;
}

/**
 * 菜谱的烹饪步骤
 */
export interface RecipeStep {
  /** 步骤序号，从1开始 */
  order: number;
  /** 步骤描述 */
  description: string;
  /** 烹饪小贴士 */
  tips?: string;
  /** 该步骤所需时间（秒） */
  time: number;
}

/**
 * 菜谱信息
 */
export interface Recipe {
  /** 菜谱唯一标识 */
  id: string;
  /** 菜谱名称 */
  name: string;
  /** 所需食材列表 */
  ingredients: RecipeIngredient[];
  /** 烹饪步骤列表 */
  steps: RecipeStep[];
  /** 菜谱的营养成分信息 */
  nutrition: {
    /** 总蛋白质含量（克） */
    totalProtein: number;    // g
    /** 总钾含量（毫克） */
    totalPotassium: number;  // mg
    /** 总磷含量（毫克） */
    totalPhosphorus: number; // mg
    /** 总钠含量（毫克） */
    totalSodium: number;     // mg
    /** 总卡路里（千卡） */
    totalCalories: number;   // kcal
  };
  /** 饮食注意事项 */
  dietNote?: string;
  /** 菜谱标签，例如：["低钠", "低脂", "家常菜"] */
  tags?: string[];
  /** 烹饪难度 */
  difficulty: '简单' | '中等' | '困难';
  /** 总烹饪时间，例如："30分钟" */
  cookingTime: string;
  /** 可供食用的人数 */
  servings: number;
} 
