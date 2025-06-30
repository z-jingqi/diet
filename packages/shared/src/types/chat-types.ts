/**
 * 菜谱详细信息
 */
export interface RecipeDetail {
  /** 菜谱详情的唯一标识符 */
  id: string;
  /** 菜谱名称 */
  name: string;
  /** 可供食用的人数，例如："2人份" */
  servings?: string;
  /** 需要的厨具，例如："炒锅、铲子" */
  tools?: string;
  /** 成本等级，例如："经济实惠"、"中等"、"高档" */
  cost?: string;
  /** 烹饪难度，例如："简单"、"中等"、"困难" */
  difficulty?: string;
  /** 菜谱特色描述，例如："低脂健康、快手菜" */
  features?: string;
  /** 菜谱生成时间，用于判断是否已生成完整菜谱 */
  generatedAt?: Date;
  /** 生成的完整菜谱的ID，用于导航到菜谱详情页面 */
  recipeId?: string;
}
