import { useEffect } from "react";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import TypingPrompt from "@/components/chat/TypingPrompt";
import ChatLayout from "@/components/chat/ChatLayout";
import { useConfirmDialog } from "@/components/providers/ConfirmDialogProvider";
import useChatStore from "@/store/chat-store";

const ChatPage = () => {
  const confirm = useConfirmDialog();

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
  } = useChatStore();

  const messages = getCurrentMessages();

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

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  // 判断是否可终止
  const canAbort =
    messages.length > 0 &&
    (() => {
      const last = messages[messages.length - 1];
      return (
        !last.isUser &&
        (last.status === "pending" || last.status === "streaming")
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
        title="新对话"
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
            />
          </div>
        </div>
      </ChatLayout>
    </div>
  );
};

export default ChatPage;
