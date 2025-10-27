"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/types/chat";
import { ChatMessageItem } from "./chat-message-item";

export type ChatMessageListProps = {
  messages: ChatMessage[];
  activeMessageId?: string | null;
  onSelectMessage?: (message: ChatMessage) => void;
};

export function ChatMessageList({ messages, activeMessageId, onSelectMessage }: ChatMessageListProps) {
  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((message) => (
          <ChatMessageItem
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
