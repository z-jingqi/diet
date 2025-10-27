"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export type ChatInputProps = {
  onSend: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function ChatInput({ onSend, placeholder = "Type your ingredients or ask a question...", disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }
    onSend(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto flex w-full max-w-3xl items-center">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[3rem] resize-none pr-14"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <Send size={18} />
      </Button>
    </form>
  );
}
