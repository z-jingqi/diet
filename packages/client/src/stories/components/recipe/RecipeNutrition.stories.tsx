import type { Meta, StoryObj } from '@storybook/react';
import RecipeNutrition from '@/components/recipe/RecipeNutrition';
import { mockRecipes } from '@/mock/Recipe';

const meta = {
  title: 'Components/Recipe/RecipeNutrition',
  component: RecipeNutrition,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeNutrition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nutrition: mockRecipes[0].nutrition,
  },
};

export const HighProtein: Story = {
  args: {
    nutrition: mockRecipes[2].nutrition,
  },
}; 