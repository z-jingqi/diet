"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { TypographyMuted, TypographyP } from "@/components/ui/typography";
import type { ChatHistoryItem } from "@/types/chat";

export type ChatSidebarProps = {
  title?: string;
  historyItems: ChatHistoryItem[];
  savedRecipesPlaceholder?: string;
  className?: string;
};

export function ChatSidebar({
  title = "Chat History",
  historyItems,
  savedRecipesPlaceholder = "Coming soon",
  className,
}: ChatSidebarProps) {
  const content = (
    <div className="flex h-full min-h-0 flex-col">
      <TypographyP className="text-lg font-semibold">{title}</TypographyP>

      <div className="mt-6 space-y-6 overflow-y-auto">
        <section>
          <TypographyMuted className="text-xs font-semibold uppercase tracking-wide">
            Recent chats
          </TypographyMuted>
          <div className="mt-3 space-y-2">
            {historyItems.map((item) => (
              <button
                key={item.id}
                className="w-full rounded-lg border border-transparent bg-background px-3 py-2 text-left transition hover:border-muted-foreground/30"
                data-conversation-id={item.conversationId}
              >
                <TypographyP className="text-sm font-medium">
                  {item.title}
                </TypographyP>
                <TypographyMuted className="text-xs">
                  {item.preview}
                </TypographyMuted>
              </button>
            ))}
          </div>
        </section>

        <section>
          <TypographyMuted className="text-xs font-semibold uppercase tracking-wide">
            Saved recipes
          </TypographyMuted>
          <div className="mt-3 space-y-2">
            <div className="rounded-lg border border-dashed border-muted-foreground/40 px-3 py-4 text-left">
              <TypographyP className="text-sm font-medium">
                {savedRecipesPlaceholder}
              </TypographyP>
              <TypographyMuted className="text-xs">
                Save favorite dishes for quick access
              </TypographyMuted>
            </div>
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
            <div className="flex h-full flex-col bg-muted/30 p-4">{content}</div>
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={cn(
          "hidden h-full min-h-0 w-[var(--sidebar-width,18rem)] flex-shrink-0 flex-col border-r bg-muted/30 p-4 md:flex",
          className
        )}
      >
        {content}
      </aside>
    </>
  );
}
