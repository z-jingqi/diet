import React from "react";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";

interface ChatLayoutProps {
  children: React.ReactNode;
  title?: string;
  onRename?: () => void;
  onClearChat?: () => void;
  onDeleteChat?: () => void;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string) => void;
  onDeleteChatItem?: (chatId: string) => void;
}

const ChatLayout = ({
  children,
  title = "新对话",
  onRename,
  onClearChat,
  onDeleteChat,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChatItem,
}: ChatLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader
        onMenuClick={handleMenuClick}
        title={title}
        onRename={onRename}
        onClearChat={onClearChat}
        onDeleteChat={onDeleteChat}
      />

      {/* Main Content */}
      <div className="flex-1 min-h-0">{children}</div>

      {/* Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <ChatSidebar
            onNewChat={() => {
              onNewChat?.();
              handleSidebarClose();
            }}
            onSelectChat={(chatId) => {
              onSelectChat?.(chatId);
              handleSidebarClose();
            }}
            onRenameChat={(chatId) => {
              onRenameChat?.(chatId);
              handleSidebarClose();
            }}
            onDeleteChat={(chatId) => {
              onDeleteChatItem?.(chatId);
              handleSidebarClose();
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatLayout;
