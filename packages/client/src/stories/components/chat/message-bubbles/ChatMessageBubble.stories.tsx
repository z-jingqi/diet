import type { Meta, StoryObj } from '@storybook/react';
import ChatMessageBubble from '../../../../components/chat/message-bubbles/chat-message-bubble';

const meta: Meta<typeof ChatMessageBubble> = {
  title: 'Chat/message-bubbles/ChatMessageBubble',
  component: ChatMessageBubble,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ChatMessageBubble>;

export const Default: Story = {
  args: {
    content: '好的，我来为您推荐番茄炒蛋的做法。',
  },
};

export const LongMessage: Story = {
  args: {
    content: '根据您的需求，我为您推荐一道低钠、营养均衡的菜谱。这道菜富含优质蛋白质和膳食纤维，钠含量较低，非常适合高血压患者食用。同时，它的烹饪方法简单，不需要太多调味料，可以很好地控制钠的摄入。',
  },
};

export const ShortMessage: Story = {
  args: {
    content: '好的，我明白了。',
  },
}; 
