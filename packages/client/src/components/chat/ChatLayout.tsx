import React from "react";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import useChatStore from "@/store/chat-store";

interface ChatLayoutProps {
  children: React.ReactNode;
  title?: string;
  onClearSession?: (sessionId: string) => void;
  onCreateNewSession?: () => void;
  onSelectSession?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const ChatLayout = ({
  children,
  title = "新对话",
  onClearSession,
  onCreateNewSession,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
}: ChatLayoutProps) => {
  const { sessions, currentSessionId } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Header */}
      <ChatHeader
        onMenuClick={handleMenuClick}
        title={title}
        onRenameSession={() => onRenameSession?.(currentSessionId ?? "")}
        onClearSession={() => onClearSession?.(currentSessionId ?? "")}
        onDeleteSession={() => onDeleteSession?.(currentSessionId ?? "")}
      />

      {/* Main Content */}
      <div className="flex-1 min-h-0">{children}</div>

      {/* Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <ChatSidebar
            sessions={sessions}
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
