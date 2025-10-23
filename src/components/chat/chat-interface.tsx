"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChatMessage } from "@/types/chat";
import type { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import {
  TypographyH1,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import { useIsMobile } from "@/hooks/use-mobile";

export type ChatInterfaceProps = {
  onRecipeSelect?: (recipe: Recipe | undefined) => void;
};

export function ChatInterface({ onRecipeSelect }: ChatInterfaceProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const messages = useMemo<ChatMessage[]>(
    () => [
      {
        id: "assistant-1",
        role: "assistant",
        content: "Hello! What ingredients do you have today?",
      },
      {
        id: "user-1",
        role: "user",
        content: "I have some chicken breast, broccoli, and soy sauce.",
      },
      {
        id: "assistant-2",
        role: "assistant",
        content: "Great! Here's a quick stir-fry recipe you can try.",
        recipe: {
          title: "Chicken & Broccoli Stir Fry",
          description:
            "A 20-minute stir fry with a savory soy-garlic sauce and crunchy vegetables.",
          ingredients: [
            { name: "Chicken breast", amount: 2, unit: "pcs" },
            { name: "Broccoli florets", amount: 2, unit: "cups" },
            { name: "Soy sauce", amount: 2, unit: "tbsp" },
            { name: "Sesame oil", amount: 1, unit: "tbsp" },
            { name: "Garlic", amount: 2, unit: "cloves", notes: "minced" },
            { name: "Ginger", amount: 1, unit: "tsp", notes: "grated" },
          ],
          steps: [
            {
              order: 1,
              instruction: "Heat sesame oil in a wok and sauté garlic and ginger until fragrant.",
              durationMinutes: 2,
              tools: ["wok", "spatula"],
            },
            {
              order: 2,
              instruction: "Add sliced chicken and cook until golden brown.",
              durationMinutes: 5,
            },
            {
              order: 3,
              instruction: "Toss in broccoli and stir-fry for 3-4 minutes.",
            },
            {
              order: 4,
              instruction: "Pour in soy sauce, toss, and cook for 2 more minutes.",
            },
            {
              order: 5,
              instruction: "Serve hot over steamed rice or noodles.",
            },
          ],
          difficulty: "easy",
          servings: 2,
          prepTimeMinutes: 10,
          cookTimeMinutes: 10,
        },
      },
    ],
    []
  );

  const welcomeMessages = useMemo(
    () => [
      "Suggest a high-protein vegan meal",
      "What can I make with chicken and rice?",
      "Quick 15-minute dinner ideas",
    ],
    []
  );

  const handleMessageClick = (message: ChatMessage) => {
    if (!message.recipe) {
      return;
    }

    if (isMobile) {
      router.push("/chat/recipe"); // placeholder route for future mobile recipe view
      return;
    }

    setSelectedMessageId(message.id);
    onRecipeSelect?.(message.recipe);
  };

  return (
    <div className="flex h-full w-full flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4 text-center">
          <header className="space-y-2">
            <TypographyH1>Welcome to DietAI</TypographyH1>
            <TypographyMuted>
              Your personal AI chef. Tell us what you have in the fridge and we’ll craft a recipe.
            </TypographyMuted>
          </header>

          <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
            {welcomeMessages.map((msg, index) => (
              <Card key={index} className="cursor-pointer p-4 text-left transition hover:bg-muted">
                <TypographyP className="text-sm font-medium md:text-base">
                  {msg}
                </TypographyP>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {messages.map((message) => {
              const isActive = selectedMessageId === message.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <Card
                    className={`max-w-[85%] md:max-w-[70%] cursor-pointer transition ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted hover:bg-muted/80"
                    } ${isActive ? "ring-2 ring-primary" : "ring-0"}`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <CardContent className="space-y-2 p-4">
                      <TypographyP className="text-sm leading-relaxed md:text-base">
                        {message.content}
                      </TypographyP>
                      {message.recipe && (
                        <TypographyMuted className="text-xs">
                          Tap to view recipe details
                        </TypographyMuted>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      <footer className="border-t bg-background p-4">
        <form className="relative mx-auto flex w-full max-w-3xl items-center">
          <Input
            placeholder="Type your ingredients or ask a question..."
            className="pr-14"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <Send size={18} />
          </Button>
        </form>
      </footer>
    </div>
  );
}
