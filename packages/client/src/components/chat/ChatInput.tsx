import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onAbort?: () => void;
  canAbort?: boolean;
}

const ChatInput = ({
  onSendMessage,
  disabled,
  onAbort,
  canAbort,
}: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSendMessage(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入您的问题..."
        className="flex-1"
        disabled={disabled}
      />
      {canAbort ? (
        <Button
          type="button"
          variant="destructive"
          onClick={onAbort}
          className="px-3"
        >
          <Square size={18} fill="currentColor" />
        </Button>
      ) : (
        <Button type="submit" disabled={disabled}>
          发送
        </Button>
      )}
    </form>
  );
};

export default ChatInput;
