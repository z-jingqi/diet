import { AIResponse } from '@shared/types/chat';
import { mockMessages } from '@shared/mock/chat';
import { mockRecipes } from '@shared/mock/recipe';
import { mockFoods } from '@shared/mock/food';

export class MockAIService {
  private async *streamResponse(data: any): AsyncGenerator<string> {
    // 将数据转换为字符串并按空格分割成单词
    const words = JSON.stringify(data).split(/(\s+)/);
    
    for (const word of words) {
      yield word;
      // 每个单词之间添加一个短暂的延迟
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  }

  async chat(prompt: string): Promise<AsyncGenerator<string>> {
    // 根据提示词判断意图
    if (prompt.includes('recipe') || prompt.includes('食谱')) {
      return this.streamResponse({
        description: '这是一道美味的食谱',
        recipes: [mockRecipes[0]]
      });
    }

    if (prompt.includes('food') || prompt.includes('食材')) {
      return this.streamResponse({
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
        }
      });
    }

    // 默认返回聊天消息
    return this.streamResponse(mockMessages[0].content);
  }

  async getIntent(prompt: string): Promise<string> {
    // 模拟意图识别
    if (prompt.includes('recipe') || prompt.includes('食谱')) {
      return 'recipe';
    }
    if (prompt.includes('food') || prompt.includes('食材')) {
      return 'food_availability';
    }
    return 'chat';
  }
} 
