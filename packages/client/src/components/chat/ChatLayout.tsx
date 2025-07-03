import React from "react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import useChatSessionStoreV2 from "@/store/chat-session-store-v2";
import { useMyChatSessions } from "@/lib/gql/hooks";
import { ChatSession } from "@/lib/gql/graphql";
import { useQueryClient } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "@/lib/gql/hooks/chat-v2";

interface ChatLayoutProps {
  children: React.ReactNode;
  onClearSession?: (sessionId: string) => void;
  onCreateNewSession?: () => void;
  onSelectSession?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onRefreshSessions?: () => void;
}

const ChatLayout = ({
  children,
  onClearSession,
  onCreateNewSession,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
  onRefreshSessions,
}: ChatLayoutProps) => {
  const { currentSessionId } = useChatSessionStoreV2();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch sessions from backend
  const { data: sessionsData, refetch } = useMyChatSessions();
  const sessions: ChatSession[] = (sessionsData?.myChatSessions ?? []).filter(
    (s): s is NonNullable<typeof s> => s !== null
  );

  // 手动刷新会话列表
  const refreshSessions = () => {
    queryClient.invalidateQueries({
      queryKey: CHAT_QUERY_KEYS.MY_CHAT_SESSIONS,
    });
    refetch();
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
    // 打开侧边栏时刷新会话列表
    refreshSessions();
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // 创建包装函数，在执行操作后刷新会话列表
  const withRefresh = (fn?: Function) => {
    return (...args: any[]) => {
      if (fn) {
        fn(...args);
      }
      // 操作完成后刷新会话列表
      refreshSessions();
      // 如果是onRefreshSessions回调存在，也执行它
      onRefreshSessions?.();
    };
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      {/* Header */}
      <ChatHeader onMenuClick={handleMenuClick} />

      {/* Main Content */}
      <div className="flex-1 min-h-0 w-full">{children}</div>

      {/* Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetTitle className="sr-only"></SheetTitle>
          <ChatSidebar
            currentSessionId={currentSessionId ?? ""}
            sessions={sessions}
            onCreateNewSession={withRefresh(onCreateNewSession)}
            onSelectSession={(sessionId) => {
              onSelectSession?.(sessionId);
              handleSidebarClose();
              refreshSessions();
            }}
            onRenameSession={(sessionId) => {
              onRenameSession?.(sessionId);
              handleSidebarClose();
              refreshSessions();
            }}
            onDeleteSession={(sessionId) => {
              onDeleteSession?.(sessionId);
              handleSidebarClose();
              refreshSessions();
            }}
            onCloseSidebar={handleSidebarClose}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatLayout;
