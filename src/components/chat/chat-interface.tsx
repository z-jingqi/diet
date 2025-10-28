"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useChat } from "@ai-sdk/react";
import type { ChatMessageMetadata } from "@/types/chat";
import type { Recipe } from "@/types/recipe";
import {
  TypographyH1,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import type { UIMessage } from "ai";
import { useConversation } from "@/hooks/use-conversations";
import { prismaMessageToUIMessage } from "@/lib/db/message-converter";

export type ChatInterfaceProps = {
  conversationId?: string;
  onRecipeSelect?: (recipe: Recipe | undefined) => void;
};

export function ChatInterface({ conversationId, onRecipeSelect }: ChatInterfaceProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const isAuthenticated = sessionStatus === "authenticated";

  // Only use conversation hooks if user is authenticated
  const { conversation, saveMessages } = useConversation(
    isAuthenticated ? (conversationId ?? null) : null
  );

  const { messages, status, error, sendMessage, clearError, setMessages } = useChat({});

  const isLoading = status === "submitted" || status === "streaming";

  // Load conversation messages when conversation changes (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, don't load from DB
      return;
    }

    if (conversation?.messages) {
      const uiMessages = conversation.messages.map((msg) =>
        prismaMessageToUIMessage(msg)
      );
      setMessages(uiMessages as UIMessage[]);
    } else {
      // Only clear messages if we explicitly have no conversation
      if (conversationId === undefined) {
        setMessages([]);
      }
    }
  }, [conversation, conversationId, setMessages, isAuthenticated]);

  // Auto-save messages when AI finishes streaming (only if authenticated)
  useEffect(() => {
    // Only save if user is authenticated and has a conversation ID
    if (!isAuthenticated || !conversationId) {
      return;
    }

    if (status === "ready" && messages.length > 0) {
      // Get the new messages that need to be saved (not in DB yet)
      const dbMessageIds = new Set(
        conversation?.messages.map((m) => m.id) ?? []
      );
      const newMessages = messages.filter((m) => !dbMessageIds.has(m.id));

      if (newMessages.length > 0) {
        // Save messages (type is compatible with ChatMessage via UIMessage)
        saveMessages(conversationId, newMessages).catch((err) => {
          console.error("Failed to save messages:", err);
        });
      }
    }
  }, [status, conversationId, messages, conversation, saveMessages, isAuthenticated]);

  const welcomeMessages = useMemo(
    () => [
      "Suggest a high-protein vegan meal",
      "What can I make with chicken and rice?",
      "Quick 15-minute dinner ideas",
    ],
    []
  );

  const handleMessageSelect = (message: UIMessage) => {
    const metadata =
      (message.metadata as ChatMessageMetadata | undefined) ?? {};
    const recipe = metadata.recipe as Recipe | undefined;

    if (!recipe) {
      return;
    }

    if (isMobile) {
      router.push("/chat/recipe");
      return;
    }

    setActiveMessageId(message.id);
    onRecipeSelect?.(recipe);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    if (error) {
      clearError();
    }

    sendMessage({ text: trimmed });
    setInput("");
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex w-full flex-col">
      {hasMessages ? (
        <ChatMessageList
          chatStatus={status}
          messages={messages}
          activeMessageId={activeMessageId}
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
        <ChatInput
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
      </footer>
    </div>
  );
}
