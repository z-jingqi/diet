"use client";

import { cn } from "@/lib/utils";
import { extractTextFromUIMessage } from "@/lib/db/message-converter";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/types/chat";

type ConversationListItemProps = {
  id: string;
  title: string;
  lastMessage?: ChatMessage;
  updatedAt: Date;
  messageCount: number;
  isActive?: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

export function ConversationListItem({
  id,
  title,
  lastMessage,
  updatedAt,
  messageCount,
  isActive,
  onSelect,
  onDelete,
}: ConversationListItemProps) {
  const preview = lastMessage
    ? extractTextFromUIMessage(lastMessage).slice(0, 50)
    : "No messages yet";

  const timeAgo = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-1 rounded-lg border p-3 transition-colors hover:bg-accent",
        isActive ? "border-primary bg-accent" : "border-border"
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 text-left"
        data-conversation-id={id}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
            <h3 className="font-medium truncate">{title}</h3>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{timeAgo}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{preview}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{messageCount} messages</span>
        </div>
      </button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-3 w-3" />
        <span className="sr-only">Delete conversation</span>
      </Button>
    </div>
  );
}

