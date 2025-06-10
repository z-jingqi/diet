import type { Meta, StoryObj } from '@storybook/react';
import ChatMessages from '../../../components/chat/chat-messages';
import { mockMessages } from '../../../mock/chat';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'zustand';
import type { Message } from '../../../types/chat';
import type { Recipe } from '../../../types/recipe';
import useChatStore from '../../../store/chat';
import useRecipeStore from '../../../store/recipe';
import type { ReactNode } from 'react';

// Create mock stores
const createMockChatStore = (initialState = {}) => create(() => ({
  messages: mockMessages,
  isLoading: false,
  error: null,
  addMessage: (message: Message) => {},
  setLoading: (isLoading: boolean) => {},
  setError: (error: string | null) => {},
  clearMessages: () => {},
  ...initialState,
}));

const createMockRecipeStore = () => create(() => ({
  currentRecipe: null,
  setCurrentRecipe: (recipe: Recipe | null) => {},
}));

// Create store providers
interface StoreProviderProps {
  children: ReactNode;
  initialState?: Record<string, unknown>;
}

const ChatStoreProvider = ({ children, initialState = {} }: StoreProviderProps) => {
  const store = createMockChatStore(initialState);
  useChatStore.setState(store.getState());
  return <>{children}</>;
};

const RecipeStoreProvider = ({ children }: { children: ReactNode }) => {
  const store = createMockRecipeStore();
  useRecipeStore.setState(store.getState());
  return <>{children}</>;
};

const meta: Meta<typeof ChatMessages> = {
  title: 'Chat/ChatMessages',
  component: ChatMessages,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ChatStoreProvider>
          <RecipeStoreProvider>
            <div className="h-[600px] w-full bg-background flex flex-col">
              <Story />
            </div>
          </RecipeStoreProvider>
        </ChatStoreProvider>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  decorators: [
    (Story) => (
      <ChatStoreProvider initialState={{ isLoading: true }}>
        <RecipeStoreProvider>
          <div className="h-[600px] w-full bg-background flex flex-col">
            <Story />
          </div>
        </RecipeStoreProvider>
      </ChatStoreProvider>
    ),
  ],
}; 
