import React from "react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import { useChatSessions } from "@/lib/gql/hooks/chat-hooks";
import { useAuth } from "@/contexts/AuthContext";

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

  // 获取登录状态
  const { isAuthenticated } = useAuth();

  // 打开侧边栏时刷新会话列表
  const handleMenuClick = () => {
    setIsSidebarOpen(true);
    refetchSessions();
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // 渲染侧边栏组件
  const renderSidebar = () => (
    <ChatSidebar
      currentSessionId={currentSessionId}
      sessions={sessions || []}
      onCloseSidebar={handleSidebarClose}
      isLoading={isLoadingSessions}
      onSessionsChange={refetchSessions}
    />
  );

  // 使用 Sheet 组件统一布局
  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      {/* Header - 仅在已登录状态下渲染 */}
      {isAuthenticated && (
        <ChatHeader
          onMenuClick={handleMenuClick}
          currentSessionId={currentSessionId}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-0 w-full">{children}</div>

      {/* Sidebar - 仅在已登录状态下渲染 */}
      {isAuthenticated && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetTitle className="sr-only"></SheetTitle>
            {renderSidebar()}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ChatLayout;
