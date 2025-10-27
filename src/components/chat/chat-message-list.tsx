"use client";

import type { ChatStatus, UIMessage } from "ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageItem } from "./chat-message-item";

export type ChatMessageListProps = {
  messages: UIMessage[];
  activeMessageId?: string | null;
  chatStatus: ChatStatus;
  onSelectMessage?: (message: UIMessage) => void;
};

export function ChatMessageList({
  messages,
  activeMessageId,
  chatStatus,
  onSelectMessage,
}: ChatMessageListProps) {
  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((message) => (
          <ChatMessageItem
            chatStatus={chatStatus}
            key={message.id}
            message={message}
            isActive={activeMessageId === message.id}
            onSelect={onSelectMessage}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
