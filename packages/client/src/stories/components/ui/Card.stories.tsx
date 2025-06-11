import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const meta = {
  title: 'Components/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>卡片标题</CardTitle>
          <CardDescription>卡片描述</CardDescription>
        </CardHeader>
        <CardContent>
          <p>这是卡片的内容</p>
        </CardContent>
        <CardFooter>
          <p>这是卡片的底部</p>
        </CardFooter>
      </>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>长内容卡片</CardTitle>
          <CardDescription>这是一个包含长内容的卡片示例</CardDescription>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }, (_, i) => (
            <p key={i} className="mb-2">
              这是第 {i + 1} 段内容，用于测试长内容的显示效果。这是一段较长的文本，用来展示卡片如何处理多行内容。
            </p>
          ))}
        </CardContent>
        <CardFooter>
          <p>卡片底部信息</p>
        </CardFooter>
      </>
    ),
  },
}; 
