"use client";

import { useMemo, useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TypographyMuted, TypographyP } from "@/components/ui/typography";
import type { ChatHistoryItem } from "@/types/chat";

export type ChatSidebarProps = {
  title?: string;
  historyItems: ChatHistoryItem[];
  className?: string;
  onCreateChat?: () => void;
  onSelectConversation?: (conversationId: string) => void;
};

export function ChatSidebar({
  title = "Chat History",
  historyItems,
  className,
  onCreateChat,
  onSelectConversation,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return historyItems;
    }
    const keyword = searchTerm.trim().toLowerCase();
    return historyItems.filter((item) =>
      [item.title, item.preview]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [historyItems, searchTerm]);

  const content = (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-2">
        <TypographyP className="text-lg font-semibold">{title}</TypographyP>
        <Button
          size="icon"
          variant="secondary"
          onClick={onCreateChat}
          aria-label="Create new chat"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search conversations"
          className="h-9"
        />
      </div>

      <div className="mt-6 space-y-6 overflow-y-auto">
        <section>
          <TypographyMuted className="text-xs font-semibold uppercase tracking-wide">
            Recent chats
          </TypographyMuted>
          <div className="mt-3 space-y-2">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                className="w-full rounded-lg border border-transparent bg-background px-3 py-2 text-left transition hover:border-muted-foreground/30"
                data-conversation-id={item.conversationId}
                onClick={() => onSelectConversation?.(item.conversationId)}
              >
                <TypographyP className="text-sm font-medium">
                  {item.title}
                </TypographyP>
                <TypographyMuted className="text-xs">
                  {item.preview}
                </TypographyMuted>
              </button>
            ))}

            {filteredItems.length === 0 && (
              <TypographyMuted className="text-xs">
                No conversations found.
              </TypographyMuted>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-4 z-30 rounded-full bg-background/90 shadow"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 max-w-sm p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col bg-muted/30 p-4">{content}</div>
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={cn(
          "hidden w-[var(--sidebar-width,18rem)] flex-shrink-0 flex-col border-r bg-muted/30 p-4 md:flex",
          className
        )}
      >
        {content}
      </aside>
    </>
  );
}
