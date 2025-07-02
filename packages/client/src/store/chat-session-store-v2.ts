import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { 
  ChatSessionStoreV2,
  ChatSessionState
} from "./chat-types-v2";
import { ChatMessage, ChatSession, Tag } from "@/lib/gql/graphql";
import useAuthStore from "@/store/auth-store";
import chatSessionServiceV2 from "@/services/chat-session-service-v2";
import { createEmptyChatSessionV2, generateChatSessionTitleV2, createUserMessageV2 } from "@/utils/chat-utils-v2";
import { useChatSessionsV2 } from "@/lib/gql/hooks/chat-v2";

// Initial state for chat sessions
const initialSessionState: ChatSessionState = {
  currentSessionId: null,
  isTemporarySession: false,
  isNewSession: true
};

/**
 * Store for managing chat sessions
 */
const useChatSessionStoreV2 = create<ChatSessionStoreV2>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...initialSessionState,
        
        // Basic state setters
        setCurrentSession: (currentSessionId) => set({ currentSessionId }),
        setTemporarySession: (isTemporarySession) => set({ isTemporarySession }),
        setIsNewSession: (isNewSession) => set({ isNewSession }),
        
        // Action: Create new session
        createSession: async (initialMessageContent) => {
          const { isAuthenticated, isGuestMode } = useAuthStore.getState();
          
          // Convert initial message content to ChatMessage if provided
          const initialMessages: ChatMessage[] = initialMessageContent 
            ? [createUserMessageV2(initialMessageContent)]
            : [];
          
          // For guest mode or unauthenticated users, create a temporary session
          if (!isAuthenticated || isGuestMode) {
            const tempSession = chatSessionServiceV2.createTemporarySession();
            const id = tempSession.id || nanoid(); // Ensure we always have an ID
            
            set({
              currentSessionId: id,
              isTemporarySession: true,
              isNewSession: false
            });
            
            return id;
          }
          
          // For authenticated users, create a persistent session
          try {
            const newSession = await chatSessionServiceV2.createSession(
              "New Chat", 
              initialMessages
            );
            
            const sessionId = newSession.id || nanoid(); // Ensure we always have an ID
            
            set({
              currentSessionId: sessionId,
              isTemporarySession: false,
              isNewSession: false
            });
            
            return sessionId;
          } catch (error) {
            console.error("Error creating session:", error);
            
            // Fallback to temporary session if API call fails
            const tempSession = chatSessionServiceV2.createTemporarySession();
            const fallbackId = tempSession.id || nanoid(); // Ensure we always have an ID
            
            set({
              currentSessionId: fallbackId,
              isTemporarySession: true,
              isNewSession: false
            });
            
            return fallbackId;
          }
        },
        
        // Action: Create a temporary session
        createTemporarySession: () => {
          const tempSession = chatSessionServiceV2.createTemporarySession();
          const id = tempSession.id || nanoid(); // Ensure we always have an ID
          
          set({
            currentSessionId: id,
            isTemporarySession: true,
            isNewSession: true
          });
          
          return id;
        },
        
        // Action: Switch to a different session
        switchSession: (sessionId) => {
          const { currentSessionId, isTemporarySession } = get();
          
          // If current session is temporary and switching to a different one,
          // we can discard the temporary session
          if (isTemporarySession && currentSessionId && currentSessionId !== sessionId) {
            // No need to delete from backend as it's temporary
            // Just update state
          }
          
          set({
            currentSessionId: sessionId,
            isTemporarySession: false,
            isNewSession: false
          });
        },
        
        // Action: Delete a session
        deleteSession: async (sessionId) => {
          const { currentSessionId, isTemporarySession } = get();
          const { isAuthenticated, isGuestMode } = useAuthStore.getState();
          
          // For authenticated users, delete from backend
          if (!isTemporarySession && isAuthenticated && !isGuestMode) {
            try {
              await chatSessionServiceV2.deleteSession(sessionId);
            } catch (error) {
              console.error(`Error deleting session ${sessionId}:`, error);
              // Continue with local deletion even if API call fails
            }
          }
          
          // If deleting current session, reset to new session state
          if (sessionId === currentSessionId) {
            set({
              currentSessionId: null,
              isTemporarySession: false,
              isNewSession: true
            });
          }
        },
        
        // Action: Rename a session
        renameSession: async (sessionId, title) => {
          const { isTemporarySession } = get();
          const { isAuthenticated, isGuestMode } = useAuthStore.getState();
          
          // For authenticated users, update on backend
          if (!isTemporarySession && isAuthenticated && !isGuestMode) {
            try {
              await chatSessionServiceV2.updateSession(sessionId, { title });
            } catch (error) {
              console.error(`Error renaming session ${sessionId}:`, error);
            }
          }
        },
        
        // Action: Update session tags
        updateSessionTags: async (sessionId, tags) => {
          const { isTemporarySession } = get();
          const { isAuthenticated, isGuestMode } = useAuthStore.getState();
          
          // For authenticated users, update on backend
          if (!isTemporarySession && isAuthenticated && !isGuestMode) {
            try {
              await chatSessionServiceV2.updateSessionTags(sessionId, tags);
            } catch (error) {
              console.error(`Error updating tags for session ${sessionId}:`, error);
            }
          }
        }
      }),
      {
        name: "chat-session-store-v2",
        // Only persist session ID, not temporary flag
        partialize: (state) => ({
          currentSessionId: state.currentSessionId
        }),
      }
    ),
    { name: "chat-session-store-v2" }
  )
);

export default useChatSessionStoreV2; 
