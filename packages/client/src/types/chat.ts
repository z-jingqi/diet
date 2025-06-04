export type MessageType = 'text' | 'recipe';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  isUser: boolean;
  recipeId?: string;  // 如果是菜谱消息，则包含菜谱ID
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
} 
