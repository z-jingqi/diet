import type { Meta, StoryObj } from '@storybook/react';
import type { MessageType, FoodAvailability, PrecautionType } from '@/types/chat';
import MessageBubble from '@/components/chat/MessageBubble';

const meta: Meta<typeof MessageBubble> = {
  title: 'Chat/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
  argTypes: {
    onRecipeClick: { action: 'recipe clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof MessageBubble>;

const mockUserMessage = {
  id: '1',
  content: '我想吃番茄炒蛋',
  isUser: true,
  type: 'chat' as MessageType,
  createdAt: new Date(),
};

const mockAssistantMessage = {
  id: '2',
  content: '好的，我来为您推荐番茄炒蛋的做法。',
  isUser: false,
  type: 'chat' as MessageType,
  createdAt: new Date(),
};

const mockRecipeMessage = {
  id: '3',
  content: '这是一道简单美味的家常菜，以下是具体做法：',
  isUser: false,
  type: 'recipe' as MessageType,
  recipes: [
    {
      id: '1',
      name: '番茄炒蛋',
      description: '一道经典的家常菜',
      ingredients: [
        {
          name: '番茄',
          amount: '2个',
          nutrition: {
            protein: 1.1,
            potassium: 237,
            phosphorus: 24,
            sodium: 5,
            calories: 22,
          },
          order: 1,
          purpose: '主要食材',
        },
        {
          name: '鸡蛋',
          amount: '3个',
          nutrition: {
            protein: 12.9,
            potassium: 138,
            phosphorus: 198,
            sodium: 140,
            calories: 155,
          },
          order: 2,
          purpose: '主要蛋白质来源',
        },
      ],
      steps: [
        {
          order: 1,
          description: '打散鸡蛋',
          time: 60,
          tips: '加入少量盐调味',
        },
        {
          order: 2,
          description: '切番茄',
          time: 120,
          tips: '切成小块',
        },
      ],
      nutrition: {
        totalProtein: 14,
        totalPotassium: 375,
        totalPhosphorus: 222,
        totalSodium: 145,
        totalCalories: 177,
      },
      dietNote: '适合大多数人群',
      tags: ['家常菜', '快手菜'],
      difficulty: '简单' as const,
      cookingTime: '10分钟',
      servings: 2,
    },
  ],
  createdAt: new Date(),
};

const mockFoodAvailabilityMessage = {
  id: '4',
  content: '根据您的饮食需求，这道菜的营养成分分析如下：',
  isUser: false,
  type: 'food_availability' as MessageType,
  foodAvailability: {
    type: 'recipe' as const,
    query: '番茄炒蛋',
    result: {
      availability: '可吃' as FoodAvailability,
      reason: '营养成分均衡，适合大多数人群',
      alternatives: [],
    },
    ingredients: [
      {
        name: '番茄',
        availability: '可吃' as FoodAvailability,
        reason: '富含维生素和矿物质',
        alternatives: [],
      },
      {
        name: '鸡蛋',
        availability: '可吃' as FoodAvailability,
        reason: '优质蛋白质来源',
        alternatives: [],
      },
    ],
    nutrition_analysis: {
      key_nutrients: [
        {
          name: '蛋白质',
          amount: '14g',
          impact: '优质蛋白质来源',
        },
        {
          name: '钠',
          amount: '145mg',
          impact: '钠含量适中',
        },
      ],
      daily_value_percentage: {
        protein: 28,
        potassium: 11,
        phosphorus: 32,
        sodium: 6,
      },
    },
    precautions: [
      {
        type: '食用量' as PrecautionType,
        content: '建议每次食用一份',
      },
    ],
  },
  createdAt: new Date(),
};

export const UserMessage: Story = {
  args: {
    message: mockUserMessage,
  },
};

export const AssistantMessage: Story = {
  args: {
    message: mockAssistantMessage,
  },
};

export const RecipeMessage: Story = {
  args: {
    message: mockRecipeMessage,
  },
};

export const FoodAvailabilityMessage: Story = {
  args: {
    message: mockFoodAvailabilityMessage,
  },
}; 
