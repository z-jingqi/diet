import type { ChatDataState } from "./chat-state";
import type { ChatActionSlice } from "./chat-actions";
import type { ChatEffectSlice } from "./chat-effects";
import type { ChatCompletionMessageParam } from "openai/resources";
import { ChatMessage, ChatSession } from "@/lib/gql/graphql";

// handlers defined in chat-store (high-level async intent handlers)
export interface ChatHighLevelHandlers {
  handleUserMessage: (content: string) => void;
  handleRecipeChatIntent: (
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
  handleHealthAdviceChatIntent: (
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
  handleChatIntent: (
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
  handleError: (error: unknown, addMessage: (msg: ChatMessage) => void) => void;
  _persistSession: (session: ChatSession, isNew: boolean) => Promise<void>;
}

export type FullChatStore = ChatDataState &
  ChatActionSlice &
  ChatEffectSlice &
  ChatHighLevelHandlers & {
    abortController?: AbortController;
  };
