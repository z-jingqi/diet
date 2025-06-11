import type { Meta, StoryObj } from '@storybook/react';
import RecipeSteps from '@/components/recipe/RecipeSteps';
import { mockRecipes } from '@/mock/Recipe';

const meta = {
  title: 'Components/Recipe/RecipeSteps',
  component: RecipeSteps,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: mockRecipes[0].steps,
  },
};

export const ManySteps: Story = {
  args: {
    steps: mockRecipes[2].steps,
  },
}; 