"use client";

import { cn } from "@/lib/utils";
import { TypographyMuted } from "@/components/ui/typography";
import type { ChatStatus, UIMessage } from "ai";
import type { ChatMessageMetadata } from "@/types/chat";
import { Streamdown } from "streamdown";

export type ChatMessageItemProps = {
  message: UIMessage;
  isActive?: boolean;
  chatStatus: ChatStatus;
  onSelect?: (message: UIMessage) => void;
};

export function ChatMessageItem({
  message,
  isActive,
  onSelect,
}: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const metadata = (message.metadata as ChatMessageMetadata | undefined) ?? {};
  const hasRecipe = Boolean(metadata.hasRecipe || metadata.recipe);

  return (
    <div
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
      data-role={message.role}
      data-message-id={message.id}
    >
      <button
        type="button"
        onClick={() => onSelect?.(message)}
        className={cn(
          "max-w-[85%] cursor-pointer rounded-2xl px-4 py-3 text-left shadow-sm transition md:max-w-[70%]",
          isUser
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-foreground hover:bg-muted/80",
          isActive ? "ring-2 ring-primary" : "ring-0"
        )}
      >
        {message.parts
          .filter((part) => part.type === "text")
          .map((part, index) => (
            <Streamdown isAnimating={status === "streaming"} key={index}>
              {part.text}
            </Streamdown>
          ))}
        {hasRecipe && (
          <TypographyMuted className="mt-2 text-xs">
            Tap to view recipe details
          </TypographyMuted>
        )}
      </button>
    </div>
  );
}
