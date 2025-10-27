"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ChatMessage } from "@/types/chat";
import type { Recipe } from "@/types/recipe";
import { TypographyH1, TypographyMuted, TypographyP } from "@/components/ui/typography";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { mockChatMessages } from "@/mocks/chat";

export type ChatInterfaceProps = {
  onRecipeSelect?: (recipe: Recipe | undefined) => void;
};

export function ChatInterface({ onRecipeSelect }: ChatInterfaceProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const messages = useMemo<ChatMessage[]>(() => mockChatMessages, []);

  const welcomeMessages = [
    "Suggest a high-protein vegan meal",
    "What can I make with chicken and rice?",
    "Quick 15-minute dinner ideas",
  ];

  const handleMessageSelect = useCallback(
    (message: ChatMessage) => {
      if (!message.recipe) {
        return;
      }

      if (isMobile) {
        router.push("/chat/recipe");
        return;
      }

      setSelectedMessageId(message.id);
      onRecipeSelect?.(message.recipe);
    },
    [isMobile, onRecipeSelect, router]
  );

  const handleSendMessage = useCallback((value: string) => {
    console.log("Send message", value);
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex w-full flex-col">
      {hasMessages ? (
        <ChatMessageList
          messages={messages}
          activeMessageId={selectedMessageId}
          onSelectMessage={handleMessageSelect}
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4 text-center">
          <header className="space-y-2">
            <TypographyH1>Welcome to DietAI</TypographyH1>
            <TypographyMuted>
              Your personal AI chef. Tell us what you have in the fridge and
              we’ll craft a recipe.
            </TypographyMuted>
          </header>

          <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
            {welcomeMessages.map((msg, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-lg bg-muted p-4 text-left transition hover:bg-muted/80"
              >
                <TypographyP className="text-sm font-medium md:text-base">
                  {msg}
                </TypographyP>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="border-t bg-background p-4">
        <ChatInput onSend={handleSendMessage} />
      </footer>
    </div>
  );
}
