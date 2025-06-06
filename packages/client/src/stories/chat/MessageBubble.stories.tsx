import type { Meta, StoryObj } from '@storybook/react';
import { MessageBubble } from '../../components/chat/message-bubble';
import { mockMessages } from '../../mock/chat';

const meta: Meta<typeof MessageBubble> = {
  title: 'Chat/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof MessageBubble>;

const userMessage = mockMessages.find(m => m.isUser)!;
const assistantMessage = mockMessages.find(m => !m.isUser && m.type === 'chat')!;
const recipeMessage = mockMessages.find(m => m.type === 'recipe')!;

export const User: Story = {
  args: {
    message: userMessage,
  },
};

export const Assistant: Story = {
  args: {
    message: assistantMessage,
  },
};

export const Recipe: Story = {
  args: {
    message: recipeMessage,
  },
}; 
