import React from "react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import { useChatSessions } from "@/lib/gql/hooks/chat-hooks";
import { ChatSession } from "@/lib/gql/graphql";

interface ChatLayoutProps {
  children: React.ReactNode;
  currentSessionId: string;
  isTemporarySession: boolean;
}

const ChatLayout = ({
  children,
  currentSessionId,
  isTemporarySession,
}: ChatLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 使用hooks获取会话列表
  const {
    sessions,
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useChatSessions();

  // 打开侧边栏时刷新会话列表
  const handleMenuClick = () => {
    setIsSidebarOpen(true);
    refetchSessions();
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      {/* Header */}
      <ChatHeader
        onMenuClick={handleMenuClick}
        currentSessionId={currentSessionId}
        isTemporarySession={isTemporarySession}
      />

      {/* Main Content */}
      <div className="flex-1 min-h-0 w-full">{children}</div>

      {/* Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetTitle className="sr-only"></SheetTitle>
          <ChatSidebar
            currentSessionId={currentSessionId}
            sessions={sessions || []}
            onCloseSidebar={handleSidebarClose}
            isLoading={isLoadingSessions}
            onSessionsChange={refetchSessions}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatLayout;
