import { ChatCompletionMessageParam } from "openai/resources";
import { 
  ChatMessage, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  ChatSession,
  Tag
} from "@/lib/gql/graphql";

/**
 * Core chat session state types
 */
export interface ChatSessionState {
  currentSessionId: string | null;
  isTemporarySession: boolean;
  isNewSession: boolean;
}

/**
 * Core chat messaging state types
 */
export interface ChatMessagingState {
  isLoading: boolean;
  gettingIntent: boolean;
  abortController?: AbortController;
  error: string | null;
}

/**
 * Basic session operations
 */
export interface ChatSessionOperations {
  setCurrentSession: (sessionId: string | null) => void;
  setTemporarySession: (isTemporary: boolean) => void;
  setIsNewSession: (isNew: boolean) => void;
}

/**
 * Messaging operations
 */
export interface ChatMessagingOperations {
  setLoading: (isLoading: boolean) => void;
  setGettingIntent: (isGetting: boolean) => void;
  setAbortController: (controller: AbortController | undefined) => void;
  setError: (error: string | null) => void;
}

/**
 * High-level chat actions
 */
export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  abortCurrentMessage: () => void;
  clearMessages: (sessionId: string) => Promise<void>;
  fetchSessionMessages: (sessionId: string) => Promise<ChatMessage[]>;
}

/**
 * Session management actions
 */
export interface ChatSessionActions {
  createSession: (initialMessage?: string) => Promise<string>;
  createTemporarySession: () => string;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => Promise<void>;
  renameSession: (sessionId: string, title: string) => Promise<void>;
  updateSessionTags: (sessionId: string, tags: Tag[]) => Promise<void>;
}

/**
 * Intent handling types
 */
export interface ChatIntentHandlers {
  handleUserMessage: (content: string) => void;
  handleRecipeIntent: (
    sessionId: string,
    messages: ChatMessage[],
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
  handleHealthAdviceIntent: (
    sessionId: string,
    messages: ChatMessage[],
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
  handleChatIntent: (
    sessionId: string,
    messages: ChatMessage[],
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
}

/**
 * Combined chat store type
 */
export type ChatStoreV2 = 
  ChatSessionState & 
  ChatMessagingState & 
  ChatSessionOperations & 
  ChatMessagingOperations &
  ChatActions &
  ChatIntentHandlers;

/**
 * Combined session store type
 */
export type ChatSessionStoreV2 = 
  ChatSessionState & 
  ChatSessionOperations & 
  ChatSessionActions; 
