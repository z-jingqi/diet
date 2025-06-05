/**
 * 食物营养成分
 */
export interface Nutrition {
  /** 蛋白质含量（克） */
  protein: number;      // g
  /** 钾含量（毫克） */
  potassium: number;    // mg
  /** 磷含量（毫克） */
  phosphorus: number;   // mg
  /** 钠含量（毫克） */
  sodium: number;       // mg
  /** 卡路里（千卡） */
  calories: number;     // kcal
}

/**
 * 食物基本信息（用于菜谱中的食材）
 */
export interface Food {
  /** 食物名称 */
  name: string;
  /** 食物用量，例如："100g"、"2个" */
  amount: string;
  /** 食物营养成分（每100克） */
  nutrition: Nutrition;
} 
