"use client";

import type { FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export type ChatInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
};

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="relative mx-auto flex w-full max-w-3xl items-center">
      <Textarea
        value={value}
        onChange={onChange}
        placeholder="Type your ingredients or ask a question..."
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
