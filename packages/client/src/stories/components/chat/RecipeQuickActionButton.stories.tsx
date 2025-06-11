import type { Meta, StoryObj } from '@storybook/react';
import RecipeQuickActionButton from '../../../components/chat/recipe-quick-action-button';

const meta: Meta<typeof RecipeQuickActionButton> = {
  title: 'Chat/RecipeQuickActionButton',
  component: RecipeQuickActionButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'recipe clicked' },
    onPreview: { action: 'preview clicked' },
    onFavorite: { action: 'favorite clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof RecipeQuickActionButton>;

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
    recipe: mockRecipe,
  },
};

export const LongRecipeName: Story = {
  args: {
    recipe: {
      ...mockRecipe,
      name: '这是一道非常长的菜名，用来测试文本换行和布局效果',
    },
  },
};

export const WithoutActions: Story = {
  args: {
    recipe: mockRecipe,
    onPreview: undefined,
    onFavorite: undefined,
  },
}; 
