import type { Meta, StoryObj } from '@storybook/react';
import RecipeMessageBubble from '../../../../components/chat/message-bubbles/recipe-message-bubble';

const meta: Meta<typeof RecipeMessageBubble> = {
  title: 'Chat/message-bubbles/RecipeMessageBubble',
  component: RecipeMessageBubble,
  tags: ['autodocs'],
  argTypes: {
    onRecipeClick: { action: 'recipe clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof RecipeMessageBubble>;

const mockRecipe = {
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
};

export const Default: Story = {
  args: {
    content: '这是一道简单美味的家常菜，以下是具体做法：',
    recipes: [mockRecipe],
  },
};

export const MultipleRecipes: Story = {
  args: {
    content: '我为您找到了几道适合的菜谱：',
    recipes: [
      mockRecipe,
      {
        ...mockRecipe,
        id: '2',
        name: '清炒西兰花',
        description: '一道健康的素菜',
        ingredients: [
          {
            name: '西兰花',
            amount: '300g',
            nutrition: {
              protein: 2.8,
              potassium: 316,
              phosphorus: 66,
              sodium: 33,
              calories: 34,
            },
            order: 1,
            purpose: '主要食材',
          },
        ],
        steps: [
          {
            order: 1,
            description: '西兰花切小朵',
            time: 120,
            tips: '切得均匀一些',
          },
        ],
        nutrition: {
          totalProtein: 2.8,
          totalPotassium: 316,
          totalPhosphorus: 66,
          totalSodium: 33,
          totalCalories: 34,
        },
        dietNote: '适合大多数人群',
        tags: ['素菜', '快手菜'],
        difficulty: '简单' as const,
        cookingTime: '5分钟',
        servings: 2,
      },
    ],
  },
}; 
