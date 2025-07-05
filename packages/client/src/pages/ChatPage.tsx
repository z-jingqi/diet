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
import {
  MessageRole,
  MessageStatus,
  MessageType,
  ChatMessage,
  ChatSession,
} from "@/lib/gql/graphql";
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

  // Ref to track if initial session setup is done
  const initializedRef = useRef(false);

  // Chat store selectors
  const {
    sendMessage,
    abortCurrentMessage,
    isLoading,
    gettingIntent,
    abortController,
    error,
    clearMessages,
    fetchSessionMessages,
  } = useChatStoreV2();

  // Chat session store selectors
  const {
    currentSessionId,
    isTemporarySession,
    createTemporarySession,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    setCurrentSession,
  } = useChatSessionStoreV2();

  // Chat message store - 使用原始选择器避免无限循环
  const messageStore = useChatMessageStoreV2();

  // 使用 useCallback 包装获取消息的函数，避免在依赖项中直接使用 store 函数
  const getSessionMessages = useCallback(
    (sessionId: string) => {
      return messageStore.getMessagesForSession(sessionId);
    },
    [messageStore]
  );

  const addMessageToStore = useCallback(
    (sessionId: string, message: ChatMessage) => {
      messageStore.addMessage(sessionId, message);
    },
    [messageStore]
  );

  const setMessagesInStore = useCallback(
    (sessionId: string, messages: ChatMessage[]) => {
      messageStore.setMessages(sessionId, messages);
    },
    [messageStore]
  );

  const updateMessageInStore = useCallback(
    (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => {
      messageStore.updateMessage(sessionId, messageId, updates);
    },
    [messageStore]
  );

  const appendToMessageInStore = useCallback(
    (sessionId: string, messageId: string, content: string) => {
      messageStore.appendToMessage(sessionId, messageId, content);
    },
    [messageStore]
  );

  // GraphQL query for chat sessions
  const { sessions, isLoading: isLoadingSessions } = useChatSessionsV2();

  // Local state for messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 保存上一次的currentSessionId，避免不必要的更新
  const prevSessionIdRef = useRef<string | null>(null);

  // Update messages when currentSessionId changes
  useEffect(() => {
    if (!currentSessionId) {
      setMessages([]);
      return;
    }

    // 如果会话ID没有变化，不做任何处理
    if (prevSessionIdRef.current === currentSessionId) {
      return;
    }

    // 更新上一次的会话ID
    prevSessionIdRef.current = currentSessionId;

    // 从会话列表中查找当前会话
    const currentSession = sessions.find((s) => s.id === currentSessionId);

    if (currentSession && currentSession.messages) {
      // 如果找到会话，将其消息加载到store中
      console.log(`Loading messages for session ${currentSessionId}`);

      // 使用setTimeout避免在渲染周期内触发状态更新
      setTimeout(() => {
        const messages = currentSession.messages || [];
        messageStore.setMessages(currentSessionId, messages);
        setMessages(messages);
      }, 0);
    } else {
      // 如果找不到会话或没有消息，从store中获取
      const sessionMessages = getSessionMessages(currentSessionId);
      console.log(
        `Current session ${currentSessionId}, found ${sessionMessages.length} messages in store`
      );
      setMessages(sessionMessages);
    }
  }, [currentSessionId, sessions]);

  // When the component mounts, handle URL session ID or create temporary session
  useEffect(() => {
    // 避免重复初始化
    if (initializedRef.current) return;

    // 标记为已初始化，避免重复执行
    initializedRef.current = true;

    const initializeSession = async () => {
      // 只在组件首次挂载或URL参数/会话列表变化时执行
      if (sessionId && sessions.some((s) => s.id === sessionId)) {
        // 如果URL有有效的会话ID，切换到该会话
        // 注意：消息加载已经在另一个useEffect中处理
        switchSession(sessionId);
      } else if (!currentSessionId) {
        // 只有在没有当前会话ID时才创建临时会话
        // 使用setTimeout避免在渲染周期内触发状态更新
        setTimeout(() => {
          createTemporarySession();
        }, 0);
      }
    };

    initializeSession();
  }, [
    sessionId,
    sessions,
    switchSession,
    createTemporarySession,
    currentSessionId,
  ]);

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

      // 1. 创建会话或确保当前会话有效
      let sessionId = currentSessionId;

      if (!sessionId || isTemporarySession) {
        // 对于任何用户（包括登录用户），先创建一个会话（可能是临时的）
        // createSession内部会自动判断是临时还是永久
        sessionId = await createSession(content);
        // 如果是登录用户创建了新会话，刷新会话列表
        if (isAuthenticated && !isGuestMode) {
          handleRefreshSessions();
        }
      }

      // 2. 添加用户消息到本地状态和store
      const userMessage = createUserMessageV2(content);
      addMessageToStore(sessionId, userMessage);

      // 3. 更新本地状态显示用户消息
      setMessages((prev) => [...prev, userMessage]);

      // 4. 开始意图检测
      const sessionMessages = getSessionMessages(sessionId);
      const AIMessages = toAIMessagesV2(sessionMessages);

      // 5. 确定意图类型
      const controller = new AbortController();
      const intent = await chatServiceV2.determineIntent(
        AIMessages,
        controller.signal,
        isGuestMode
      );

      // 6. 创建AI消息占位符
      const aiMessage = createAIMessageV2(intent);
      aiMessage.status = MessageStatus.Streaming;
      aiMessage.content = "";

      // 7. 添加AI消息到store和本地状态
      addMessageToStore(sessionId, aiMessage);
      setMessages((prev) => [...prev, aiMessage]);

      // 8. 存储AI消息ID用于流式更新
      currentAIMessageIdRef.current = aiMessage.id || null;

      if (!currentAIMessageIdRef.current) {
        processingMessageRef.current = false;
        return;
      }

      // 9. 流式响应
      await streamResponse(sessionId, aiMessage.id!, intent, AIMessages);

      // 10. 更新本地状态
      const finalMessages = getSessionMessages(sessionId);
      setMessages(finalMessages);

      processingMessageRef.current = false;
    } catch (error) {
      console.error("Error sending message:", error);
      processingMessageRef.current = false;
    }
  };

  // Stream response based on intent
  const streamResponse = async (
    sessionId: string,
    messageId: string,
    intent: MessageType,
    aiMessages: any
  ) => {
    try {
      let content = "";
      const controller = new AbortController();

      // 确保我们使用最新的会话ID（可能已从临时会话转换为永久会话）
      const currentId =
        useChatSessionStoreV2.getState().currentSessionId || sessionId;

      console.log(
        "Starting streaming response for message:",
        messageId,
        "with intent:",
        intent,
        "in session:",
        currentId
      );

      // Make sure messages are in the correct format for the API
      const formattedMessages = toAIMessagesV2(aiMessages);

      // Choose the appropriate service based on intent
      const streamFunction =
        intent === MessageType.Recipe
          ? chatServiceV2.sendRecipeMessage
          : intent === MessageType.HealthAdvice
            ? chatServiceV2.sendHealthAdviceMessage
            : chatServiceV2.sendChatMessage;

      // Stream the response
      await streamFunction(
        formattedMessages,
        (data) => {
          // 获取最新的会话ID，因为会话ID可能在流式传输过程中发生变化
          const latestSessionId =
            useChatSessionStoreV2.getState().currentSessionId || currentId;

          if (data.done) {
            console.log("Stream completed for message:", messageId);
            // Complete the message
            updateMessageInStore(latestSessionId, messageId, {
              status: MessageStatus.Done,
            });
            return;
          }

          if (data.response) {
            content += data.response;

            // Update the message content in store
            appendToMessageInStore(latestSessionId, messageId, data.response);

            // Force update local state for immediate UI update
            setMessages((prev) => {
              const updated = prev.map((msg) =>
                msg.id === messageId
                  ? {
                      ...msg,
                      content: (msg.content || "") + data.response,
                      status: MessageStatus.Streaming,
                    }
                  : msg
              );
              return [...updated]; // Create a new array to force re-render
            });
          }
        },
        (error) => {
          // 获取最新的会话ID处理错误
          const latestSessionId =
            useChatSessionStoreV2.getState().currentSessionId || currentId;
          console.error("Streaming error:", error);
          updateMessageInStore(latestSessionId, messageId, {
            status: MessageStatus.Error,
          });
        },
        controller.signal,
        isGuestMode
      );

      // Final update with the latest session ID
      const latestSessionId =
        useChatSessionStoreV2.getState().currentSessionId || currentId;
      console.log(
        "Final message update for:",
        messageId,
        "in session:",
        latestSessionId
      );
      updateMessageInStore(latestSessionId, messageId, {
        content,
        status: MessageStatus.Done,
      });
    } catch (error) {
      const latestSessionId =
        useChatSessionStoreV2.getState().currentSessionId || sessionId;
      console.error("Error streaming response:", error);
      updateMessageInStore(latestSessionId, messageId, {
        status: MessageStatus.Error,
      });
    }
  };

  // Determine if message can be sent
  const canSend =
    !processingMessageRef.current && canSendMessageV2(messages, gettingIntent);

  // Determine if message can be aborted
  const canAbort = !!abortController;

  // Handle session clearing
  const handleClearSession = async () => {
    if (!currentSessionId) return;

    const ok = await confirm({
      title: "Clear this conversation?",
      description:
        "This cannot be undone. All messages will be permanently deleted.",
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
      description:
        "This cannot be undone. The entire conversation will be permanently deleted.",
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
    // 切换会话，消息加载由currentSessionId的useEffect处理
    console.log(`Switching to session ${sessionId}`);
    switchSession(sessionId);
  };

  // Rename current session
  const handleRenameSession = (sessionId: string) => {
    const newTitle = prompt("Enter new conversation title:");
    if (newTitle) {
      renameSession(sessionId, newTitle);
    }
  };

  // Refresh sessions list
  const handleRefreshSessions = () => {
    // This will be handled by ChatLayout's built-in refresh logic
    console.log("Refreshing sessions list");
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <ChatLayout
        onClearSession={handleClearSession}
        onDeleteSession={handleDeleteSession}
        onCreateNewSession={handleCreateNewSession}
        onSelectSession={handleSelectSession}
        onRenameSession={handleRenameSession}
        onRefreshSessions={handleRefreshSessions}
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
              placeholder={
                isGuestMode
                  ? "Enter message to start chatting..."
                  : "Enter message..."
              }
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
