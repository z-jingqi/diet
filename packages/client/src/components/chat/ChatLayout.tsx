import React from "react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import useChatSessionStoreV2 from "@/store/chat-session-store-v2";

interface ChatLayoutProps {
  children: React.ReactNode;
  onClearSession?: (sessionId: string) => void;
  onCreateNewSession?: () => void;
  onSelectSession?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const ChatLayout = ({
  children,
  onClearSession,
  onCreateNewSession,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
}: ChatLayoutProps) => {
  const { currentSessionId } = useChatSessionStoreV2();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
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
            onCreateNewSession={onCreateNewSession}
            onSelectSession={(sessionId) => {
              onSelectSession?.(sessionId);
              handleSidebarClose();
            }}
            onRenameSession={(sessionId) => {
              onRenameSession?.(sessionId);
              handleSidebarClose();
            }}
            onDeleteSession={(sessionId) => {
              onDeleteSession?.(sessionId);
              handleSidebarClose();
            }}
            onCloseSidebar={handleSidebarClose}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatLayout;
