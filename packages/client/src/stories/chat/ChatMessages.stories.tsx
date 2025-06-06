import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessages } from '../../components/chat/chat-messages';
import { mockMessages } from '../../mock/chat';

const meta: Meta<typeof ChatMessages> = {
  title: 'Chat/ChatMessages',
  component: ChatMessages,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ChatMessages>;

export const Default: Story = {
  args: {
    messages: mockMessages,
  },
}; 
