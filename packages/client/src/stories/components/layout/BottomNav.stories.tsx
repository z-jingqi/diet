import type { Meta, StoryObj } from '@storybook/react';
import BottomNav from '@/components/layout/bottom-nav';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Components/Layout/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    initialPath: {
      control: 'select',
      options: ['/chat', '/favorites', '/profile'],
    },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { initialPath: string }) => (
  <MemoryRouter initialEntries={[args.initialPath]}>
    <div className="relative h-[100vh] w-full bg-background">
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-muted-foreground">Page Content</p>
      </div>
      <BottomNav />
    </div>
  </MemoryRouter>
);

export const ChatPage: Story = {
  render: (args) => Template(args as { initialPath: string }),
  args: {
    initialPath: '/chat',
  },
};

export const FavoritesPage: Story = {
  render: (args) => Template(args as { initialPath: string }),
  args: {
    initialPath: '/favorites',
  },
};

export const ProfilePage: Story = {
  render: (args) => Template(args as { initialPath: string }),
  args: {
    initialPath: '/profile',
  },
}; 
