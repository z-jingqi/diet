import { useEffect, useState } from 'react';
import { ChatMessage, MessageRole, MessageStatus, MessageType } from '@/lib/gql/graphql';
import useChatStoreV2 from '@/store/chat-store-v2';
import useChatSessionStoreV2 from '@/store/chat-session-store-v2';
import useChatMessageStoreV2 from '@/store/chat-message-store-v2';
import useAuthStore from '@/store/auth-store';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import TypingPrompt from '@/components/chat/TypingPrompt';
import { canSendMessageV2 } from '@/utils/chat-utils-v2';

interface ChatContainerV2Props {
  sessionId?: string;
}

const ChatContainerV2 = ({ sessionId }: ChatContainerV2Props) => {
  // Chat store selectors
  const {
    sendMessage,
    abortCurrentMessage,
    isLoading,
    gettingIntent,
    abortController,
    error
  } = useChatStoreV2();

  // Session store selectors
  const {
    currentSessionId,
    isTemporarySession,
    createSession,
    createTemporarySession
  } = useChatSessionStoreV2();

  // Message store selectors
  const { 
    getMessagesForSession 
  } = useChatMessageStoreV2();

  // Auth state
  const { isAuthenticated, isGuestMode } = useAuthStore();

  // Get current session ID (from props or store)
  const activeSessionId = sessionId || currentSessionId;
  
  // Get messages for the active session
  const messages = activeSessionId 
    ? getMessagesForSession(activeSessionId) 
    : [];

  // Initialize session if needed
  useEffect(() => {
    const initializeSession = async () => {
      if (!activeSessionId) {
        if (isAuthenticated && !isGuestMode) {
          // For logged-in users, create a permanent session
          await createSession();
        } else {
          // For guest users, create a temporary session
          createTemporarySession();
        }
      }
    };
    
    initializeSession();
  }, [activeSessionId, isAuthenticated, isGuestMode, createSession, createTemporarySession]);

  // Send message handler
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      // If logged-in user with temporary session, convert to permanent
      if (isAuthenticated && !isGuestMode && isTemporarySession) {
        await createSession(content);
        return;
      }
      
      await sendMessage(content);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Check if we can send a message
  const canSend = canSendMessageV2(messages, gettingIntent);
  
  // Can abort if there's an active abort controller
  const canAbort = !!abortController;

  return (
    <div className="flex flex-col h-full">
      {/* Messages display area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <TypingPrompt />
        ) : (
          <ChatMessages messages={messages} />
        )}
      </div>

      {/* Input area */}
      <div className="px-4 py-2">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!canSend}
          canAbort={canAbort}
          onAbort={abortCurrentMessage}
          placeholder={isGuestMode ? "Enter message to start chatting..." : "Enter message..."}
        />
        
        {error && (
          <div className="text-destructive text-sm mt-1">
            {error}
          </div>
        )}
        
        {/* Guest mode notice */}
        {isGuestMode && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Guest mode: Conversations aren't saved.{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Login
              </a>{" "}
              to save your conversations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainerV2; 
