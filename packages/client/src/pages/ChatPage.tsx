import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import TypingPrompt from "@/components/chat/TypingPrompt";
import ChatLayout from "@/components/chat/ChatLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  useChatSession,
  useChatMessaging,
  useCreateChatSession,
} from "@/lib/gql/hooks/chat-hooks";
import { ChatMessage, MessageRole, MessageStatus } from "@/lib/gql/graphql";
import { buildUserMessage } from "@/utils/message-builder";

const ChatPage = () => {
  const { sessionId } = useParams({ from: "/$sessionId" });
  const navigate = useNavigate();
  const { isAuthenticated, isGuestMode } = useAuth();

  // 当前会话状态
  const [currentSessionId, setCurrentSessionId] = useState<string>(
    sessionId || ""
  );
  const [isTemporarySession, setIsTemporarySession] = useState(!sessionId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // 从hooks获取会话数据和方法
  const { session, isLoading: isSessionLoading } =
    useChatSession(currentSessionId);
  const { mutateAsync: createChatSession } = useCreateChatSession();
  const {
    sendMessage,
    isLoading: isMessageLoading,
    abortCurrentMessage,
    isGettingIntent,
    createTemporarySession,
    abortController,
  } = useChatMessaging();

  // 如果URL中没有sessionId，创建一个临时会话
  useEffect(() => {
    if (!currentSessionId) {
      const tempSession = createTemporarySession();
      setCurrentSessionId(tempSession.id || "");
      setIsTemporarySession(true);
      setMessages([]);
    }
  }, [createTemporarySession, currentSessionId]);

  // 当从后端获取到会话时，更新消息列表
  useEffect(() => {
    if (session && session.messages && !isStreaming) {
      setMessages(session.messages as ChatMessage[]);
      setIsTemporarySession(false);
    }
  }, [session, isStreaming]);

  // 发送消息处理函数
  const handleSendMessage = async (content: string, tagIds?: string[]) => {
    if (!content.trim() || !currentSessionId) return;

    // 乐观更新：立即添加用户消息到本地状态
    const userMessage = buildUserMessage(content);
    const previousMessages = [...messages];
    const optimisticMessages = [...previousMessages, userMessage];
    setMessages(optimisticMessages);

    // 如果是临时会话且用户已登录，先创建正式会话
    let targetSessionId = currentSessionId;
    let newSessionId: string | null = null;

    if (isTemporarySession && isAuthenticated && !isGuestMode) {
      try {
        // 创建正式会话
        const result = await createChatSession({
          title: content.slice(0, 20) + (content.length > 20 ? "..." : ""),
          messages: JSON.stringify([userMessage]),
          tagIds: tagIds || [],
        });

        if (result.createChatSession) {
          // 保存新的 sessionId，但不立即更新状态
          newSessionId = result.createChatSession.id || "";
          targetSessionId = newSessionId;
        }
      } catch (error) {
        console.error("Failed to create session:", error);
        // 如果创建失败，继续使用临时会话
      }
    }

    try {
      setIsStreaming(true);

      // 使用 hook 的 sendMessage 方法，它会自动处理意图判断和消息发送
      const result = await sendMessage({
        sessionId: targetSessionId,
        content,
        existingMessages: previousMessages,
        onStreamStart: (aiMsg) => {
          // 把流式 AI 消息插入列表（初始为空内容）
          setMessages((prev) => [...prev, { ...aiMsg, content: "" }]);
        },
        onChunkReceived: (chunk) => {
          setMessages((prev) => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            const last = updated[lastIdx];
            if (last.role === MessageRole.Assistant) {
              updated[lastIdx] = {
                ...last,
                content: `${last.content || ""}${chunk}`,
                status: MessageStatus.Streaming,
              } as ChatMessage;
            }
            return updated;
          });
        },
        isGuestMode,
      });

      // 更新本地消息列表
      if (result && result.allMessages) {
        setMessages(result.allMessages);
      }

      // AI 响应完成后，再更新 sessionId 和 URL（避免竞态条件）
      if (newSessionId) {
        setCurrentSessionId(newSessionId);
        setIsTemporarySession(false);
        navigate({ to: `/${newSessionId}` });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // 错误处理：保持乐观更新的消息，让用户知道发送失败
    } finally {
      setIsStreaming(false);
    }
  };

  // 处理中止消息
  const handleAbortMessage = () => {
    abortCurrentMessage();
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <ChatLayout
        currentSessionId={currentSessionId}
        isTemporarySession={isTemporarySession}
      >
        <div className="flex flex-col h-full w-full">
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
            {messages.length === 0 ? (
              <TypingPrompt />
            ) : (
              <ChatMessages
                messages={messages}
                gettingIntent={isGettingIntent}
              />
            )}
          </div>

          {/* Input area - fixed at bottom */}
          <div className="w-full max-w-3xl mx-auto p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isMessageLoading || isSessionLoading}
              canAbort={!!abortController}
              onAbort={handleAbortMessage}
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
