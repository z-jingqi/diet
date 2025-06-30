import { useEffect } from "react";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import TypingPrompt from "@/components/chat/TypingPrompt";
import ChatLayout from "@/components/chat/ChatLayout";
import { useConfirmDialog } from "@/components/providers/ConfirmDialogProvider";
import useChatStore from "@/store/chat-store";
import useAuthStore from "@/store/auth-store";
import { useMyChatSessions } from "@/lib/gql/hooks/chat";
import { MessageRole, MessageStatus } from "@/lib/gql/graphql";

const ChatPage = () => {
  const confirm = useConfirmDialog();
  const { isAuthenticated, isGuestMode, enableGuest } = useAuthStore();

  const {
    getCurrentMessages,
    sendMessage,
    canSendMessage,
    abortCurrentMessage,
    currentSessionId,
    createTemporarySession,
    switchSession,
    deleteSession,
    renameSession,
    clearSession,
    loadSessionsFromGraphQL,
  } = useChatStore();

  // GraphQL 查询用户聊天会话
  const { data: graphqlSessions, isLoading: isLoadingSessions } =
    useMyChatSessions();

  const messages = getCurrentMessages();

  // 当 GraphQL 数据加载完成且用户已认证时，加载会话到 store
  useEffect(() => {
    if (isAuthenticated && !isGuestMode && graphqlSessions?.myChatSessions) {
      // 过滤掉 null 值并转换数据格式
      const validSessions = graphqlSessions.myChatSessions
        .filter(
          (session): session is NonNullable<typeof session> => session !== null
        )
        .map((session) => ({
          id: session.id || "",
          title: session.title || "新对话",
          messages:
            session.messages?.filter(
              (msg): msg is NonNullable<typeof msg> => msg !== null
            ) || [],
          currentTags:
            session.tagIds?.filter((tag): tag is string => tag !== null) || [],
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        }));

      loadSessionsFromGraphQL(validSessions);
    }
  }, [isAuthenticated, isGuestMode, graphqlSessions, loadSessionsFromGraphQL]);

  // 进入页面时创建临时会话
  useEffect(() => {
    if (!currentSessionId) {
      createTemporarySession();
    }
  }, [currentSessionId, createTemporarySession]);

  // 离开页面时清理临时会话
  useEffect(() => {
    return () => {
      // 组件卸载时，如果当前是临时会话则删除
      const { isTemporarySession, currentSessionId } = useChatStore.getState();
      if (isTemporarySession && currentSessionId) {
        useChatStore.getState().deleteSession(currentSessionId);
      }
    };
  }, []);

  // 如果用户未认证且未启用游客模式，自动启用游客模式
  useEffect(() => {
    if (!isAuthenticated && !isGuestMode) {
      enableGuest();
    }
  }, [isAuthenticated, isGuestMode, enableGuest]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  // 判断是否可终止
  const canAbort =
    messages.length > 0 &&
    (() => {
      const last = messages[messages.length - 1];
      return (
        last.role !== MessageRole.User &&
        (last.status === MessageStatus.Pending ||
          last.status === MessageStatus.Streaming)
      );
    })();

  const handleClearSession = async () => {
    const ok = await confirm({
      title: "确定要清空当前对话吗？",
      description: "此操作无法撤销，当前对话的所有消息将被永久删除。",
      confirmText: "清空",
      cancelText: "取消",
      confirmVariant: "destructive",
    });
    if (ok && currentSessionId) {
      clearSession(currentSessionId);
    }
  };

  const handleDeleteSession = async () => {
    if (currentSessionId) {
      const ok = await confirm({
        title: "确定要删除这个对话吗？",
        description: "此操作无法撤销，删除后对话将永久丢失。",
        confirmText: "删除",
        cancelText: "取消",
        confirmVariant: "destructive",
      });
      if (ok) {
        deleteSession(currentSessionId);
      }
    }
  };

  const handleCreateNewSession = () => {
    createTemporarySession();
  };

  const handleSelectSession = (sessionId: string) => {
    switchSession(sessionId);
  };

  const handleRenameSession = (sessionId: string) => {
    const newTitle = prompt("请输入新的标题:");
    if (newTitle) {
      renameSession(sessionId, newTitle);
    }
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <ChatLayout
        title={isGuestMode ? "游客体验" : "新对话"}
        onClearSession={handleClearSession}
        onDeleteSession={handleDeleteSession}
        onCreateNewSession={handleCreateNewSession}
        onSelectSession={handleSelectSession}
        onRenameSession={handleRenameSession}
      >
        <div className="flex flex-col h-full w-full">
          {/* 主要内容区域 */}
          <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
            {messages.length === 0 ? <TypingPrompt /> : <ChatMessages />}
          </div>

          {/* 输入框区域 - 固定在底部 */}
          <div className="w-full max-w-3xl mx-auto p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!canSendMessage()}
              canAbort={canAbort}
              onAbort={abortCurrentMessage}
              placeholder={isGuestMode ? "输入消息开始体验..." : "输入消息..."}
            />

            {/* 游客模式底部提示 */}
            {isGuestMode && (
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  游客模式下无法保存对话历史，
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    登录
                  </button>
                  可保存和管理对话记录
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
