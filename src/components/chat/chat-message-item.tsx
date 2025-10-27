"use client";

import { cn } from "@/lib/utils";
import { TypographyMuted, TypographyP } from "@/components/ui/typography";
import type { ChatMessage } from "@/types/chat";

export type ChatMessageItemProps = {
  message: ChatMessage;
  isActive?: boolean;
  onSelect?: (message: ChatMessage) => void;
};

export function ChatMessageItem({ message, isActive, onSelect }: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const hasRecipe = Boolean(message.recipeId || message.recipe || message.metadata?.hasRecipe);

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
        <TypographyP className="text-sm leading-relaxed md:text-base">
          {message.content}
        </TypographyP>
        {hasRecipe && (
          <TypographyMuted className="mt-2 text-xs">
            Tap to view recipe details
          </TypographyMuted>
        )}
      </button>
    </div>
  );
}
