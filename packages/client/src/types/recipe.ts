export interface BasicRecipeInfo {
  id: string;
  /** 菜品名称 */
  name: string;
  /** 人均花费原始字符串，例如 "15-25元" */
  avgCost: string;
  /** 预计耗时原始字符串，例如 "30分钟" */
  duration: string;
  /** 难度，例如 "简单" | "中等" | "困难" */
  difficulty: string;
  /** 主食材列表（逗号分隔） */
  mainIngredients: string;
}
