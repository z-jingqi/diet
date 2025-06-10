import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '@/components/ui/scroll-area';

const meta = {
  title: 'Components/UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-[200px] w-[350px] rounded-md border p-4",
    children: Array.from({ length: 20 }, (_, i) => (
      <div key={i} className="mb-4">
        这是第 {i + 1} 行内容
      </div>
    )),
  },
};

export const WithLongContent: Story = {
  args: {
    className: "h-[200px] w-[350px] rounded-md border p-4",
    children: Array.from({ length: 50 }, (_, i) => (
      <div key={i} className="mb-4">
        这是一段很长的内容，用于测试滚动区域。这是第 {i + 1} 行，包含更多的文字来确保内容足够长。
      </div>
    )),
  },
}; 