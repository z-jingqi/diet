export const RECIPE_SCHEMA = {
  type: "object",
  description: "菜谱数据结构",
  properties: {
    description: { 
      type: "string",
      description: "菜谱说明文字，可以是简单的一句话，也可以是 markdown 格式的详细说明"
    },
    recipes: {
      type: "array",
      description: "菜谱数组",
      items: {
        type: "object",
        required: ["id", "name", "ingredients", "steps", "nutrition", "difficulty", "cookingTime", "servings"],
        properties: {
          id: { 
            type: "string",
            description: "菜谱唯一标识"
          },
          name: { 
            type: "string",
            description: "菜谱名称"
          },
          ingredients: {
            type: "array",
            description: "所需食材列表",
            items: {
              type: "object",
              required: ["name", "amount", "nutrition", "order"],
              properties: {
                name: { 
                  type: "string",
                  description: "食材名称"
                },
                amount: { 
                  type: "string",
                  description: "食材用量"
                },
                nutrition: {
                  type: "object",
                  description: "食材营养成分（每100克）",
                  required: ["protein", "potassium", "phosphorus", "sodium", "calories"],
                  properties: {
                    protein: { 
                      type: "number",
                      description: "蛋白质含量（克）"
                    },
                    potassium: { 
                      type: "number",
                      description: "钾含量（毫克）"
                    },
                    phosphorus: { 
                      type: "number",
                      description: "磷含量（毫克）"
                    },
                    sodium: { 
                      type: "number",
                      description: "钠含量（毫克）"
                    },
                    calories: { 
                      type: "number",
                      description: "卡路里（千卡）"
                    }
                  }
                },
                order: { 
                  type: "number",
                  description: "食材在菜谱中的序号"
                },
                purpose: { 
                  type: "string",
                  description: "食材在菜谱中的用途说明"
                }
              }
            }
          },
          steps: {
            type: "array",
            description: "烹饪步骤列表",
            items: {
              type: "object",
              required: ["order", "description", "time"],
              properties: {
                order: { 
                  type: "number",
                  description: "步骤序号"
                },
                description: { 
                  type: "string",
                  description: "步骤描述"
                },
                tips: { 
                  type: "string",
                  description: "烹饪小贴士"
                },
                time: { 
                  type: "number",
                  description: "该步骤所需时间（秒）"
                }
              }
            }
          },
          nutrition: {
            type: "object",
            description: "菜谱的营养成分信息",
            required: ["totalProtein", "totalPotassium", "totalPhosphorus", "totalSodium", "totalCalories"],
            properties: {
              totalProtein: { 
                type: "number",
                description: "总蛋白质含量（克）"
              },
              totalPotassium: { 
                type: "number",
                description: "总钾含量（毫克）"
              },
              totalPhosphorus: { 
                type: "number",
                description: "总磷含量（毫克）"
              },
              totalSodium: { 
                type: "number",
                description: "总钠含量（毫克）"
              },
              totalCalories: { 
                type: "number",
                description: "总卡路里（千卡）"
              }
            }
          },
          dietNote: { 
            type: "string",
            description: "饮食注意事项"
          },
          tags: { 
            type: "array", 
            items: { type: "string" },
            description: "菜谱标签，如：低钠、低脂等"
          },
          difficulty: { 
            type: "string", 
            enum: ["简单", "中等", "困难"],
            description: "烹饪难度"
          },
          cookingTime: { 
            type: "string",
            description: "总烹饪时间"
          },
          servings: { 
            type: "number",
            description: "可供食用的人数"
          }
        }
      }
    }
  }
} as const; 