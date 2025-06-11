import type { Meta, StoryObj } from '@storybook/react';
import RecipeIngredients from '@/components/recipe/RecipeIngredients';
import { mockRecipes } from '@shared/mock/recipe';

const meta = {
  title: 'Components/Recipe/RecipeIngredients',
  component: RecipeIngredients,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeIngredients>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ingredients: mockRecipes[0].ingredients,
  },
};

export const ManyIngredients: Story = {
  args: {
    ingredients: mockRecipes[2].ingredients,
  },
}; 
