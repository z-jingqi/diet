import { useEffect, useState, useCallback, useRef } from "react";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import TypingPrompt from "@/components/chat/TypingPrompt";
import ChatLayout from "@/components/chat/ChatLayout";
import { useConfirmDialog } from "@/components/providers/ConfirmDialogProvider";
import useChatStoreV2 from "@/store/chat-store-v2";
import useChatSessionStoreV2 from "@/store/chat-session-store-v2";
import useChatMessageStoreV2 from "@/store/chat-message-store-v2";
import useAuthStore from "@/store/auth-store";
import { useChatSessionsV2 } from "@/lib/gql/hooks/chat-v2";
import { MessageRole, MessageStatus, MessageType, ChatMessage } from "@/lib/gql/graphql";
import { canSendMessageV2, createAIMessageV2 } from "@/utils/chat-utils-v2";
import { createUserMessageV2 } from "@/utils/chat-utils-v2";
import chatServiceV2 from "@/services/chat-service-v2";
import { toAIMessagesV2 } from "@/utils/chat-utils-v2";

interface ChatPageProps {
  sessionId?: string;
}

const ChatPage = ({ sessionId }: ChatPageProps = {}) => {
  const confirm = useConfirmDialog();
  const { isAuthenticated, isGuestMode, enableGuest } = useAuthStore();
  
  // Ref to track if a message is being processed
  const processingMessageRef = useRef(false);
  
  // Ref to store the current AI message ID
  const currentAIMessageIdRef = useRef<string | null>(null);

  // Chat store selectors
  const {
    sendMessage,
    abortCurrentMessage,
    isLoading,
    gettingIntent,
    abortController,
    error,
    clearMessages,
    fetchSessionMessages
  } = useChatStoreV2();

  // Chat session store selectors
  const {
    currentSessionId,
    isTemporarySession,
    createTemporarySession,
    createSession,
    switchSession,
    deleteSession,
    renameSession
  } = useChatSessionStoreV2();

  // Chat message store - 使用原始选择器避免无限循环
  const messageStore = useChatMessageStoreV2();
  
  // 使用 useCallback 包装获取消息的函数，避免在依赖项中直接使用 store 函数
  const getSessionMessages = useCallback((sessionId: string) => {
    return messageStore.getMessagesForSession(sessionId);
  }, [messageStore]);
  
  const addMessageToStore = useCallback((sessionId: string, message: ChatMessage) => {
    messageStore.addMessage(sessionId, message);
  }, [messageStore]);
  
  const setMessagesInStore = useCallback((sessionId: string, messages: ChatMessage[]) => {
    messageStore.setMessages(sessionId, messages);
  }, [messageStore]);
  
  const updateMessageInStore = useCallback((sessionId: string, messageId: string, updates: Partial<ChatMessage>) => {
    messageStore.updateMessage(sessionId, messageId, updates);
  }, [messageStore]);
  
  const appendToMessageInStore = useCallback((sessionId: string, messageId: string, content: string) => {
    messageStore.appendToMessage(sessionId, messageId, content);
  }, [messageStore]);

  // GraphQL query for chat sessions
  const { sessions, isLoading: isLoadingSessions } = useChatSessionsV2();

  // Local state for messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // When the component mounts, handle URL session ID or create temporary session
  useEffect(() => {
    const initializeSession = async () => {
      if (sessionId && sessions.some(s => s.id === sessionId)) {
        // If URL has a valid session ID, switch to that session
        switchSession(sessionId);
      } else if (!currentSessionId) {
        // If no current session, create a temporary one
        createTemporarySession();
      }
    };
    
    initializeSession();
  }, [sessionId, sessions, currentSessionId, switchSession, createTemporarySession]);

  // Update messages when currentSessionId changes
  useEffect(() => {
    if (currentSessionId) {
      const sessionMessages = getSessionMessages(currentSessionId);
      setMessages(sessionMessages);
    } else {
      setMessages([]);
    }
  }, [currentSessionId, getSessionMessages]);

  // If user is not authenticated and not in guest mode, enable guest mode
  useEffect(() => {
    if (!isAuthenticated && !isGuestMode) {
      enableGuest();
    }
  }, [isAuthenticated, isGuestMode, enableGuest]);

  // Custom send message implementation to handle streaming responses
  const handleSendMessage = async (content: string) => {
    try {
      if (processingMessageRef.current) return;
      
      processingMessageRef.current = true;

      // Create a permanent session for logged-in users if we're in a temporary session
      if (isAuthenticated && (!currentSessionId || isTemporarySession)) {
        await createSession();
      } else if (!currentSessionId) {
        // For guest users, ensure we have a temporary session
        createTemporarySession();
      }
      
      // Ensure we have a session ID after creation
      if (!currentSessionId) {
        console.error("Failed to create or get session ID");
        processingMessageRef.current = false;
        return;
      }
      
      // 1. Add user message to local state and store
      const userMessage = createUserMessageV2(content);
      addMessageToStore(currentSessionId, userMessage);
      
      // 2. Update local state
      setMessages(prev => [...prev, userMessage]);
      
      // 3. Begin intent detection
      const sessionMessages = getSessionMessages(currentSessionId);
      
      // 4. 获取意图 - 只传递用户消息，不包含空的 AI 消息
      const AIMessages = toAIMessagesV2(sessionMessages);
      
      // 确定意图类型
      const controller = new AbortController();
      const intent = await chatServiceV2.determineIntent(
        AIMessages,
        controller.signal,
        isGuestMode
      );
      
      // 5. 创建 AI 消息占位符 - 在确定意图后
      const aiMessage = createAIMessageV2(intent);
      aiMessage.status = MessageStatus.Streaming;
      aiMessage.content = "";
      
      // 6. 添加 AI 消息到 store 和本地状态
      addMessageToStore(currentSessionId, aiMessage);
      setMessages(prev => [...prev, aiMessage]);
      
      // 7. 存储 AI 消息 ID 用于流式更新
      currentAIMessageIdRef.current = aiMessage.id || null;
      
      if (!currentAIMessageIdRef.current) {
        processingMessageRef.current = false;
        return;
      }
      
      // 8. 流式响应
      await streamResponse(currentSessionId, aiMessage.id!, intent, AIMessages);
      
      // 9. 更新本地状态
      const finalMessages = getSessionMessages(currentSessionId);
      setMessages(finalMessages);
      
      processingMessageRef.current = false;
    } catch (error) {
      console.error("Error sending message:", error);
      processingMessageRef.current = false;
    }
  };
  
  // Stream response based on intent
  const streamResponse = async (sessionId: string, messageId: string, intent: MessageType, aiMessages: any) => {
    try {
      let content = "";
      const controller = new AbortController();
      
      console.log("Starting streaming response for message:", messageId, "with intent:", intent);
      
      // Make sure messages are in the correct format for the API
      const formattedMessages = toAIMessagesV2(aiMessages);
      
      // Choose the appropriate service based on intent
      const streamFunction = 
        intent === MessageType.Recipe ? chatServiceV2.sendRecipeMessage :
        intent === MessageType.HealthAdvice ? chatServiceV2.sendHealthAdviceMessage :
        chatServiceV2.sendChatMessage;
      
      // Stream the response
      await streamFunction(
        formattedMessages,
        (data) => {
          console.log("Stream chunk received:", data);
          
          if (data.done) {
            console.log("Stream completed for message:", messageId);
            // Complete the message
            updateMessageInStore(sessionId, messageId, {
              status: MessageStatus.Done
            });
            return;
          }
          
          if (data.response) {
            content += data.response;
            console.log(`Appending content to message ${messageId}, new length: ${content.length}`);
            
            // Update the message content in store
            appendToMessageInStore(sessionId, messageId, data.response);
            
            // Force update local state for immediate UI update
            setMessages(prev => {
              const updated = prev.map(msg => 
                msg.id === messageId 
                  ? { ...msg, content: (msg.content || "") + data.response, status: MessageStatus.Streaming } 
                  : msg
              );
              return [...updated]; // Create a new array to force re-render
            });
          }
        },
        (error) => {
          console.error("Streaming error:", error);
          updateMessageInStore(sessionId, messageId, {
            status: MessageStatus.Error
          });
        },
        controller.signal,
        isGuestMode
      );
      
      // Final update to ensure message is marked as complete
      console.log("Final message update for:", messageId);
      updateMessageInStore(sessionId, messageId, {
        content,
        status: MessageStatus.Done
      });
      
    } catch (error) {
      console.error("Error streaming response:", error);
      updateMessageInStore(sessionId, messageId, {
        status: MessageStatus.Error
      });
    }
  };

  // Determine if message can be sent
  const canSend = !processingMessageRef.current && canSendMessageV2(messages, gettingIntent);

  // Determine if message can be aborted
  const canAbort = !!abortController;

  // Handle session clearing
  const handleClearSession = async () => {
    if (!currentSessionId) return;
    
    const ok = await confirm({
      title: "Clear this conversation?",
      description: "This cannot be undone. All messages will be permanently deleted.",
      confirmText: "Clear",
      cancelText: "Cancel",
      confirmVariant: "destructive",
    });
    
    if (ok) {
      await clearMessages(currentSessionId);
      setMessagesInStore(currentSessionId, []);
      setMessages([]);
    }
  };

  // Handle session deletion
  const handleDeleteSession = async () => {
    if (!currentSessionId) return;
    
    const ok = await confirm({
      title: "Delete this conversation?",
      description: "This cannot be undone. The entire conversation will be permanently deleted.",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmVariant: "destructive",
    });
    
    if (ok) {
      const deletedSessionId = currentSessionId;
      await deleteSession(deletedSessionId);
      
      // Reset to initial state - clear messages and create temporary session for guest users
      setMessages([]);
      if (isGuestMode) {
        createTemporarySession();
      }
    }
  };

  // Create new chat session
  const handleCreateNewSession = () => {
    createTemporarySession();
  };

  // Switch to a different session
  const handleSelectSession = (sessionId: string) => {
    switchSession(sessionId);
  };

  // Rename current session
  const handleRenameSession = (sessionId: string) => {
    const newTitle = prompt("Enter new conversation title:");
    if (newTitle) {
      renameSession(sessionId, newTitle);
    }
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <ChatLayout
        onClearSession={handleClearSession}
        onDeleteSession={handleDeleteSession}
        onCreateNewSession={handleCreateNewSession}
        onSelectSession={handleSelectSession}
        onRenameSession={handleRenameSession}
      >
        <div className="flex flex-col h-full w-full">
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
            {messages.length === 0 ? (
              <TypingPrompt />
            ) : (
              <ChatMessages messages={messages} gettingIntent={gettingIntent} />
            )}
          </div>

          {/* Input area - fixed at bottom */}
          <div className="w-full max-w-3xl mx-auto p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!canSend}
              canAbort={canAbort}
              onAbort={abortCurrentMessage}
              placeholder={isGuestMode ? "Enter message to start chatting..." : "Enter message..."}
            />

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
      </ChatLayout>
    </div>
  );
};

export default ChatPage; 
