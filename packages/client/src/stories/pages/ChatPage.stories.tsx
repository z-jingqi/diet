import type { Meta, StoryObj } from '@storybook/react';
import { ChatPage } from '../../pages/chat';
import { useChatStore } from '../../store/chat';
import { mockMessages } from '../../mock/chat';

// 模拟 store 的 Provider
const ChatStoreDecorator = (Story: React.ComponentType) => {
  return (
    <div className="h-screen bg-gray-50">
      <Story />
    </div>
  );
};

const meta: Meta<typeof ChatPage> = {
  title: 'Pages/ChatPage',
  component: ChatPage,
  decorators: [ChatStoreDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof ChatPage>;

// 空状态
export const Empty: Story = {
  args: {},
  play: async () => {
    // 清空消息
    useChatStore.getState().clearMessages();
  },
};

// 有消息的状态
export const WithMessages: Story = {
  args: {},
  play: async () => {
    // 清空现有消息
    useChatStore.getState().clearMessages();
    // 添加 mock 消息
    mockMessages.forEach(message => {
      useChatStore.getState().addMessage(message);
    });
  },
};

// 打字机效果状态
export const Typing: Story = {
  args: {},
  play: async () => {
    // 清空消息，这样会触发打字机效果
    useChatStore.getState().clearMessages();
  },
}; 
