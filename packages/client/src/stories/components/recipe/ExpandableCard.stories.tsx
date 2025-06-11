import type { Meta, StoryObj } from '@storybook/react';
import ExpandableCard from '@/components/recipe/ExpandableCard';

const meta = {
  title: 'Components/Recipe/ExpandableCard',
  component: ExpandableCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExpandableCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "食材清单",
    children: "这里是食材清单的内容",
    expandedContent: "展开后显示的详细内容",
  },
};

export const LongContent: Story = {
  args: {
    title: "详细步骤",
    children: "这是一个很长的内容，包含多个段落。\n\n第一段：这是第一步的详细说明。\n\n第二段：这是第二步的详细说明。\n\n第三段：这是第三步的详细说明。",
    expandedContent: "这是展开后显示的更多详细内容，可以包含更多的信息。",
  },
}; 