import type { Meta, StoryObj } from '@storybook/react';
import RecipeBasicInfo from '@/components/recipe/RecipeBasicInfo';
import { mockRecipes } from '@shared/mock/recipe';

const meta = {
  title: 'Components/Recipe/RecipeBasicInfo',
  component: RecipeBasicInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeBasicInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recipe: mockRecipes[0],
  },
};

export const WithLongDescription: Story = {
  args: {
    recipe: {
      ...mockRecipes[0],
      dietNote: "这是一道非常适合控制钠摄入人群的沙拉，具有以下特点：营养均衡，富含优质蛋白质，提供丰富的膳食纤维，制作简单，适合减脂人群。",
    },
  },
}; 
