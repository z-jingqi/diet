import { AIResponse } from '@shared/types/chat';
import { mockMessages } from '@shared/mock/chat';
import { mockRecipes } from '@shared/mock/recipe';
import { mockFoods } from '@shared/mock/food';

export class MockAIService {
  private async *streamResponse(data: any): AsyncGenerator<string> {
    // 如果是字符串，直接按空格分割
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    const words = text.split(/(\s+)/);
    
    for (const word of words) {
      yield word;
      // 每个单词之间添加一个短暂的延迟
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  }

  async chat(prompt: string): Promise<AsyncGenerator<string>> {
    if (prompt.includes('mock recipe')) {
      return this.streamResponse({
        description: '这是一道美味的食谱',
        recipes: [mockRecipes[0]]
      });
    }

    if (prompt.includes('mock food')) {
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

    if (prompt.includes('long chat')) {
      return this.streamResponse(mockMessages[0].content);
    }

    // 默认返回聊天消息
    return this.streamResponse(mockMessages[1].content);
  }

  async getIntent(prompt: string): Promise<string> {
    // 使用特定的 mock 关键字
    if (prompt.includes('mock recipe')) {
      return 'recipe';
    }
    if (prompt.includes('mock food')) {
      return 'food_availability';
    }
    if (prompt.includes('mock chat')) {
      return 'chat';
    }
    if (prompt.includes('long chat')) {
      return 'chat';
    }
    // 如果没有 mock 关键字，默认返回 chat
    return 'chat';
  }
} 
