import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'Components/UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "低钠",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "高蛋白",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "减脂",
  },
}; 
