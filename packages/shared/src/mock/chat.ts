import type { Message, MessageType } from '../types/chat';
import type { Recipe } from '../types/recipe';

// 获取食谱数据的函数，避免循环依赖
const getMockRecipes = async (): Promise<Recipe[]> => {
  // 使用 ESM 动态导入
  const { mockRecipes } = await import('./recipe');
  return mockRecipes;
};

// 聊天消息数据
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    content: "你好，我想找一些低钠的食谱",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:00:00")
  },
  {
    id: "msg-2",
    content: "您好！我很乐意帮您寻找低钠食谱。请问您有什么特别的饮食需求或偏好吗？比如是否对某些食材过敏，或者是否有其他饮食限制？",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:05")
  },
  {
    id: "msg-3",
    content: "我最近在控制钠的摄入，希望能找到一些简单易做的菜谱",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:00:15")
  },
  {
    id: "msg-4",
    content: "明白了。我为您推荐几道低钠且容易制作的菜谱，这些菜谱都经过精心设计，既保证了营养均衡，又控制了钠的摄入。",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:20")
  },
  {
    id: "msg-5",
    content: `# 低钠鸡胸肉沙拉推荐

这是一道非常适合控制钠摄入人群的沙拉，具有以下特点：

## 营养特点
- 钠含量仅为 107mg，远低于普通菜谱
- 富含优质蛋白质（45.8g）
- 提供丰富的膳食纤维

## 制作特点
- 制作简单，只需 20 分钟
- 适合 2 人食用
- 适合减脂人群`,
    type: "recipe" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:25"),
    recipes: [] // 暂时为空数组，在运行时动态填充
  },
  {
    id: "msg-6",
    content: "这个低钠鸡胸肉沙拉看起来不错，能详细说说它的营养特点吗？",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:00:35")
  },
  {
    id: "msg-7",
    content: "这道菜谱的钠含量仅为107mg，远低于普通菜谱。同时，它富含优质蛋白质（45.8g）和膳食纤维，非常适合控制钠摄入的人群。您觉得这个菜谱怎么样？",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:40")
  },
  {
    id: "msg-8",
    content: "很好，我还想看看其他低钠的菜谱",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:00:45")
  },
  {
    id: "msg-9",
    content: `# 低钠菜谱推荐

为您推荐两道低钠菜谱，它们都具有以下特点：

## 低磷糙米粥
- 钠含量仅 79mg，适合严格控制钠摄入
- 蛋白质含量 25.6g，提供优质蛋白
- 易消化，适合消化功能较弱人群

## 高蛋白西兰花炒鸡胸
- 钠含量 181mg，适合控制钠摄入
- 蛋白质含量高达 89.4g，满足增肌需求
- 营养均衡，适合健身人群

两道菜都简单易做，营养均衡，您可以根据自己的需求选择。`,
    type: "recipe" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:50"),
    recipes: [] // 暂时为空数组，在运行时动态填充
  },
  {
    id: "msg-10",
    content: "这些菜谱都很适合您。您可以根据自己的喜好选择，需要我详细解释某个菜谱吗？",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:55")
  },
  {
    id: "msg-11",
    content: "香蕉可以吃吗？",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:01:00")
  },
  {
    id: "msg-12",
    content: JSON.stringify({
      type: "single_food",
      query: "香蕉",
      result: {
        availability: "适量",
        reason: "香蕉富含钾元素（358mg/100g），对肾脏病患者需要控制摄入量。但同时也富含维生素B6和膳食纤维，适量食用有益健康。",
        suggestions: [
          {
            type: "食用建议",
            content: "建议每次食用不超过半根，每周不超过2-3次"
          },
          {
            type: "替代食物",
            content: "可以选择苹果、梨等低钾水果作为替代"
          }
        ]
      },
      nutrition_analysis: {
        key_nutrients: [
          {
            name: "钾",
            amount: "358mg/100g",
            impact: "对肾脏病患者需要控制摄入量"
          },
          {
            name: "蛋白质",
            amount: "1.1g/100g",
            impact: "含量较低，适合控制蛋白质摄入的人群"
          },
          {
            name: "膳食纤维",
            amount: "2.6g/100g",
            impact: "有助于肠道健康"
          }
        ],
        daily_value_percentage: {
          protein: 2,
          potassium: 9,
          phosphorus: 3,
          sodium: 0
        }
      },
      precautions: [
        {
          type: "食用量",
          content: "建议每次食用不超过半根"
        },
        {
          type: "其他",
          content: "建议在饭后食用，避免空腹"
        }
      ]
    }, null, 2),
    type: "food_availability" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:01:05"),
    foodAvailability: {
      type: "single_food",
      query: "香蕉",
      result: {
        availability: "适量",
        reason: "香蕉富含钾元素（358mg/100g），对肾脏病患者需要控制摄入量。但同时也富含维生素B6和膳食纤维，适量食用有益健康。",
        suggestions: [
          {
            type: "食用建议",
            content: "建议每次食用不超过半根，每周不超过2-3次"
          },
          {
            type: "替代食物",
            content: "可以选择苹果、梨等低钾水果作为替代"
          }
        ]
      },
      nutrition_analysis: {
        key_nutrients: [
          {
            name: "钾",
            amount: "358mg/100g",
            impact: "对肾脏病患者需要控制摄入量"
          },
          {
            name: "蛋白质",
            amount: "1.1g/100g",
            impact: "含量较低，适合控制蛋白质摄入的人群"
          },
          {
            name: "膳食纤维",
            amount: "2.6g/100g",
            impact: "有助于肠道健康"
          }
        ],
        daily_value_percentage: {
          protein: 2,
          potassium: 9,
          phosphorus: 3,
          sodium: 0
        }
      },
      precautions: [
        {
          type: "食用量",
          content: "建议每次食用不超过半根"
        },
        {
          type: "其他",
          content: "建议在饭后食用，避免空腹"
        }
      ]
    }
  },
  {
    id: "msg-13",
    content: "这个低钠鸡胸肉沙拉我可以吃吗？",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:01:10")
  },
  {
    id: "msg-14",
    content: JSON.stringify({
      type: "recipe",
      query: "低钠鸡胸肉沙拉",
      result: {
        availability: "可吃",
        reason: "这道菜谱的钠含量仅为107mg，远低于普通菜谱，非常适合控制钠摄入的人群。同时，它富含优质蛋白质和膳食纤维，营养均衡。",
        suggestions: [
          {
            type: "食用建议",
            content: "建议每周食用2-3次，每次一份"
          },
          {
            type: "注意事项",
            content: "可以根据个人口味调整沙拉酱的用量"
          }
        ]
      },
      ingredients: [
        {
          name: "鸡胸肉",
          availability: "可吃",
          reason: "鸡胸肉是优质蛋白质来源，钠含量低，适合控制钠摄入的人群",
          suggestions: [
            {
              type: "食用建议",
              content: "建议选择无盐腌制的新鲜鸡胸肉"
            }
          ]
        },
        {
          name: "生菜",
          availability: "可吃",
          reason: "生菜钠含量极低，富含膳食纤维和维生素",
          suggestions: [
            {
              type: "食用建议",
              content: "建议选择新鲜的生菜，清洗干净后食用"
            }
          ]
        },
        {
          name: "小番茄",
          availability: "适量",
          reason: "小番茄钾含量适中，富含维生素C和番茄红素",
          suggestions: [
            {
              type: "食用建议",
              content: "建议每次使用4-6颗"
            }
          ]
        }
      ],
      nutrition_analysis: {
        key_nutrients: [
          {
            name: "蛋白质",
            amount: "45.8g",
            impact: "优质蛋白质来源，有助于维持肌肉健康"
          },
          {
            name: "钠",
            amount: "107mg",
            impact: "钠含量极低，适合控制钠摄入"
          },
          {
            name: "膳食纤维",
            amount: "5.2g",
            impact: "有助于肠道健康"
          }
        ],
        daily_value_percentage: {
          protein: 92,
          potassium: 8,
          phosphorus: 15,
          sodium: 5
        }
      },
      precautions: [
        {
          type: "食用量",
          content: "建议每次食用一份，每周不超过3次"
        },
        {
          type: "烹饪方式",
          content: "鸡胸肉建议用无盐调味料腌制，避免使用含钠量高的调味料"
        },
        {
          type: "搭配禁忌",
          content: "避免搭配高钠的沙拉酱或调味料"
        }
      ]
    }, null, 2),
    type: "food_availability" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:01:15"),
    foodAvailability: {
      type: "recipe",
      query: "低钠鸡胸肉沙拉",
      result: {
        availability: "可吃",
        reason: "这道菜谱的钠含量仅为107mg，远低于普通菜谱，非常适合控制钠摄入的人群。同时，它富含优质蛋白质和膳食纤维，营养均衡。",
        suggestions: [
          {
            type: "食用建议",
            content: "建议每周食用2-3次，每次一份"
          },
          {
            type: "注意事项",
            content: "可以根据个人口味调整沙拉酱的用量"
          }
        ]
      },
      ingredients: [
        {
          name: "鸡胸肉",
          availability: "可吃",
          reason: "鸡胸肉是优质蛋白质来源，钠含量低，适合控制钠摄入的人群",
          suggestions: [
            {
              type: "食用建议",
              content: "建议选择无盐腌制的新鲜鸡胸肉"
            }
          ]
        },
        {
          name: "生菜",
          availability: "可吃",
          reason: "生菜钠含量极低，富含膳食纤维和维生素",
          suggestions: [
            {
              type: "食用建议",
              content: "建议选择新鲜的生菜，清洗干净后食用"
            }
          ]
        },
        {
          name: "小番茄",
          availability: "适量",
          reason: "小番茄钾含量适中，富含维生素C和番茄红素",
          suggestions: [
            {
              type: "食用建议",
              content: "建议每次使用4-6颗"
            }
          ]
        }
      ],
      nutrition_analysis: {
        key_nutrients: [
          {
            name: "蛋白质",
            amount: "45.8g",
            impact: "优质蛋白质来源，有助于维持肌肉健康"
          },
          {
            name: "钠",
            amount: "107mg",
            impact: "钠含量极低，适合控制钠摄入"
          },
          {
            name: "膳食纤维",
            amount: "5.2g",
            impact: "有助于肠道健康"
          }
        ],
        daily_value_percentage: {
          protein: 92,
          potassium: 8,
          phosphorus: 15,
          sodium: 5
        }
      },
      precautions: [
        {
          type: "食用量",
          content: "建议每次食用一份，每周不超过3次"
        },
        {
          type: "烹饪方式",
          content: "鸡胸肉建议用无盐调味料腌制，避免使用含钠量高的调味料"
        },
        {
          type: "搭配禁忌",
          content: "避免搭配高钠的沙拉酱或调味料"
        }
      ]
    }
  }
];

// 在运行时动态填充食谱数据
getMockRecipes().then(recipes => {
  mockMessages[4].recipes = recipes.slice(0, 1);
  mockMessages[8].recipes = recipes.slice(1, 3);
}); 
 