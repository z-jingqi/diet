import { create } from 'zustand';
import type { ChatState, Message } from '../types/chat';

const useChatStore = create<ChatState & {
  addMessage: (message: Message) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [] })
}));

export default useChatStore; 
