"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export default function ChatPage() {
  const messages = [
    { role: "assistant", content: "Hello! What ingredients do you have today?" },
    { role: "user", content: "I have some chicken breast, broccoli, and soy sauce." },
    // More messages can be added here for UI testing
  ];
  
  const welcomeMessages = [
    "Suggest a high-protein vegan meal",
    "What can I make with chicken and rice?",
    "Quick 15-minute dinner ideas",
  ];

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-3xl font-bold mb-2">Welcome to DietAI</h1>
          <p className="text-muted-foreground mb-8">
            Your personal AI Chef. Start by typing your ingredients below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            {welcomeMessages.map((msg, i) => (
              <Card key={i} className="p-4 text-left cursor-pointer hover:bg-muted">
                <p className="font-medium">{msg}</p>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-xs md:max-w-md lg:max-w-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <CardContent className="p-3">
                    <p>{message.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="p-4 border-t bg-background">
        <div className="relative">
          <Input
            placeholder="Type your ingredients or ask a question..."
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
