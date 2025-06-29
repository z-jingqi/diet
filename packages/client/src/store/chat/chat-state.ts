import { ChatSession } from "@diet/shared";

export interface ChatDataState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  gettingIntent: boolean;
  isTemporarySession: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialChatState: ChatDataState = {
  sessions: [],
  currentSessionId: null,
  gettingIntent: false,
  isTemporarySession: false,
  isLoading: false,
  error: null,
};
