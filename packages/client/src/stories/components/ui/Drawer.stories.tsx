import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@/components/ui/drawer';

const meta = {
  title: 'Components/UI/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    children: (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">抽屉标题</h2>
        <p>这是抽屉的内容</p>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    children: (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">抽屉标题</h2>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="mb-2">
            这是第 {i + 1} 段内容，用于测试长内容的显示效果。
          </p>
        ))}
      </div>
    ),
  },
}; 