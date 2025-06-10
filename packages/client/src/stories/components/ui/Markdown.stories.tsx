import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from '@/components/ui/markdown';

const meta = {
  title: 'Components/UI/Markdown',
  component: Markdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "# 标题\n\n这是一段普通文本。",
  },
};

export const WithList: Story = {
  args: {
    content: "# 食材清单\n\n- 鸡胸肉 200g\n- 西兰花 100g\n- 糙米 100g",
  },
};

export const WithTable: Story = {
  args: {
    content: "# 营养成分\n\n| 营养素 | 含量 |\n|--------|------|\n| 蛋白质 | 45.8g |\n| 钠 | 107mg |",
  },
}; 