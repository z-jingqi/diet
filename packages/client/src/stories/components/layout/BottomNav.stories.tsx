import type { Meta, StoryObj } from '@storybook/react';
import BottomNav from '@/components/layout/bottom-nav';

const meta = {
  title: 'Components/Layout/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPath: '/',
  },
};

export const ChatPage: Story = {
  args: {
    currentPath: '/chat',
  },
};

export const RecipePage: Story = {
  args: {
    currentPath: '/recipe',
  },
}; 