import { useEffect, useRef } from 'react';
import { ChatMessage, MessageRole, MessageType, MessageStatus } from '@/lib/gql/graphql';
import useChatMessageStoreV2 from '@/store/chat-message-store-v2';
import useChatSessionStoreV2 from '@/store/chat-session-store-v2';
import { Skeleton } from '@/components/ui/skeleton';
import UserMessageBubbleV2 from './message-bubbles/UserMessageBubbleV2';
import AIMessageBubbleV2 from './message-bubbles/AIMessageBubbleV2';

interface ChatMessageListV2Props {
  sessionId?: string;
  className?: string;
}

const ChatMessageListV2 = ({ sessionId, className = '' }: ChatMessageListV2Props) => {
  // Get messages for current session
  const { currentSessionId } = useChatSessionStoreV2();
  const { getMessagesForSession } = useChatMessageStoreV2();
  
  const activeSessionId = sessionId || currentSessionId;
  const messages = activeSessionId ? getMessagesForSession(activeSessionId) : [];
  
  // For auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, messages[messages.length - 1]?.content]);
  
  return (
    <div className={`flex flex-col space-y-4 px-4 py-6 ${className}`}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            No messages yet. Start a conversation!
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="message-container">
            {message.role === MessageRole.User ? (
              <UserMessageBubbleV2 message={message} />
            ) : message.status === MessageStatus.Pending ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <AIMessageBubbleV2 message={message} />
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageListV2; 
