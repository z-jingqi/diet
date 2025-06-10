import type { Meta, StoryObj } from '@storybook/react';
import RecipeNotes from '@/components/recipe/recipe-notes';
import { mockRecipes } from '@/mock/recipe';

const meta = {
  title: 'Components/Recipe/RecipeNotes',
  component: RecipeNotes,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeNotes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    note: mockRecipes[0].dietNote || "适合低钠饮食人群",
  },
};

export const LongNote: Story = {
  args: {
    note: "这是一道非常适合控制钠摄入人群的沙拉，具有以下特点：营养均衡，富含优质蛋白质，提供丰富的膳食纤维，制作简单，适合减脂人群。建议在制作时注意控制盐的用量，可以使用其他调味料来增加风味。",
  },
}; 