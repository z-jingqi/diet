import type { Meta, StoryObj } from '@storybook/react';
import TypingPrompt from '../../../components/chat/typing-prompt';

const meta: Meta<typeof TypingPrompt> = {
  title: 'Chat/TypingPrompt',
  component: TypingPrompt,
  tags: ['autodocs'],
  argTypes: {
    onStartTyping: { action: 'typing started' },
    onStopTyping: { action: 'typing stopped' },
  },
};
export default meta;

type Story = StoryObj<typeof TypingPrompt>;

const defaultPrompts = [
  "今天想吃什么？",
  "有什么饮食禁忌吗？",
  "想了解什么食材？",
  "需要营养建议吗？",
];

export const Default: Story = {
  args: {
    prompts: defaultPrompts,
  },
};

export const SinglePrompt: Story = {
  args: {
    prompts: ["请输入您的问题..."],
  },
};

export const LongPrompts: Story = {
  args: {
    prompts: [
      "这是一个较长的提示文本，用于测试打字动画效果。",
      "这是另一个较长的提示文本，包含更多的内容。",
    ],
  },
}; 
