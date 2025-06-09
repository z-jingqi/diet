import type { Meta, StoryObj } from '@storybook/react';
import ChatInput from '../../components/chat/chat-input';

const meta: Meta<typeof ChatInput> = {
  title: 'Chat/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  argTypes: {
    onSendMessage: { action: 'message sent' },
  },
};
export default meta;

type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  args: {},
}; 
