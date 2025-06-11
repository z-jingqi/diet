// 意图识别 prompt
const INTENT_PROMPT = `
你是一个智能助手。请分析用户的输入，判断用户的意图。

用户意图可能是：
1. 获取普通信息（如：营养知识、烹饪技巧等）
2. 生成菜谱（如：询问食材搭配、请求菜谱推荐等）
3. 查询食物可食性（如：询问某食物是否可以食用、某菜谱是否适合等）

用户输入：{user_input}

请只返回以下三种意图之一：
- chat：普通对话
- recipe：菜谱生成
- food_availability：食物可食性查询
`;

// 普通对话 prompt
const CHAT_PROMPT = `
你是一个智能助手。请根据用户的输入生成相应的回答。

用户输入：{user_input}

请使用 markdown 格式回答，可以包含标题、列表、强调等格式。
`;

// 菜谱生成 prompt
const RECIPE_PROMPT = `
你是一个智能助手。请根据用户的输入生成相应的菜谱。

用户输入：{user_input}

请严格按照以下 JSON 格式回答，不要添加任何其他内容：
{
  "description": "菜谱说明文字，可以是简单的一句话，也可以是 markdown 格式的详细说明。如果使用 markdown，可以包含标题、列表、强调等格式，用于展示推荐理由、营养特点、适合人群等信息。",  // 必选：菜谱说明文字
  "recipes": [                             // 必选：菜谱数组
  {
    "id": "unique_id",                    // 必选：菜谱唯一标识
    "name": "菜谱名称",                    // 必选：菜谱名称
    "ingredients": [                      // 必选：所需食材列表
      {
        "name": "食材名称",                // 必选：食材名称
        "amount": "100g",                 // 必选：食材用量
        "nutrition": {                    // 必选：食材营养成分（每100克）
          "protein": 10,                  // 必选：蛋白质含量（克）
          "potassium": 200,               // 必选：钾含量（毫克）
          "phosphorus": 100,              // 必选：磷含量（毫克）
          "sodium": 50,                   // 必选：钠含量（毫克）
          "calories": 150                 // 必选：卡路里（千卡）
        },
        "order": 1,                       // 必选：食材在菜谱中的序号
        "purpose": "用于调味"              // 可选：食材在菜谱中的用途说明
      }
    ],
    "steps": [                           // 必选：烹饪步骤列表
      {
        "order": 1,                      // 必选：步骤序号
        "description": "步骤描述",         // 必选：步骤描述
        "tips": "烹饪小贴士",             // 可选：烹饪小贴士
        "time": 300                      // 必选：该步骤所需时间（秒）
      }
    ],
    "nutrition": {                       // 必选：菜谱的营养成分信息
      "totalProtein": 20,                // 必选：总蛋白质含量（克）
      "totalPotassium": 400,             // 必选：总钾含量（毫克）
      "totalPhosphorus": 200,            // 必选：总磷含量（毫克）
      "totalSodium": 100,                // 必选：总钠含量（毫克）
      "totalCalories": 300               // 必选：总卡路里（千卡）
    },
    "dietNote": "饮食注意事项",           // 可选：饮食注意事项
    "tags": ["低钠", "低脂"],             // 可选：菜谱标签
    "difficulty": "简单",                 // 必选：烹饪难度（简单/中等/困难）
    "cookingTime": "30分钟",             // 必选：总烹饪时间
    "servings": 2                        // 必选：可供食用的人数
  }
]
}
`;

// 食物可食性查询 prompt
const FOOD_AVAILABILITY_PROMPT = `
你是一个智能助手。请根据用户的输入分析食物或菜谱的可食性。

用户输入：{user_input}

请严格按照以下 JSON 格式回答，不要添加任何其他内容：
{
  "type": "single_food" | "recipe",        // 必选：查询类型（单个食物/菜谱）
  "query": "查询的食物或菜谱名称",          // 必选：用户查询的内容
  "result": {                             // 必选：查询结果
    "availability": "可吃" | "不可吃" | "适量",  // 必选：可食性结论
    "reason": "详细的原因说明，包括：\n1. 营养成分分析\n2. 对特定疾病的影响\n3. 食用建议",  // 必选：原因说明
    "suggestions": [                       // 可选：相关建议
      {
        "type": "替代食物" | "食用建议" | "注意事项",  // 建议类型
        "content": "具体建议内容"           // 建议内容
      }
    ]
  },
  "ingredients": [                         // 当 type 为 recipe 时必选：菜谱中的食材分析
    {
      "name": "食材名称",                  // 必选：食材名称
      "availability": "可吃" | "不可吃" | "适量",  // 必选：可食性结论
      "reason": "详细的原因说明",           // 必选：原因说明
      "suggestions": [                     // 可选：相关建议
        {
          "type": "替代食物" | "食用建议" | "注意事项",  // 建议类型
          "content": "具体建议内容"         // 建议内容
        }
      ]
    }
  ],
  "nutrition_analysis": {                  // 必选：营养分析
    "key_nutrients": [                     // 必选：关键营养成分
      {
        "name": "营养成分名称",            // 必选：营养成分名称
        "amount": "含量",                  // 必选：含量
        "impact": "对特定疾病的影响说明"    // 必选：影响说明
      }
    ],
    "daily_value_percentage": {            // 可选：占每日推荐摄入量的百分比
      "protein": 20,                       // 蛋白质
      "potassium": 15,                     // 钾
      "phosphorus": 10,                    // 磷
      "sodium": 5                          // 钠
    }
  },
  "precautions": [                         // 可选：注意事项
    {
      "type": "食用量" | "烹饪方式" | "搭配禁忌" | "其他",  // 注意事项类型
      "content": "具体注意事项内容"         // 注意事项内容
    }
  ]
}
`;

export {
  INTENT_PROMPT,
  CHAT_PROMPT,
  RECIPE_PROMPT,
  FOOD_AVAILABILITY_PROMPT
};
