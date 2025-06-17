export const INTENT_SCHEMA = {
  type: "string",
  description: "用户意图类型",
  enum: ["chat", "recipe", "health_advice"],
  enumDescriptions: {
    chat: "普通对话，如询问营养知识、烹饪技巧等",
    recipe: "菜谱相关，如询问食材搭配、请求菜谱推荐等",
    health_advice: "健康建议，如询问食物可食性、运动适宜性等"
  }
} as const; 