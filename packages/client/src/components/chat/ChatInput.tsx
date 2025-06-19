import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Square, Send } from "lucide-react";
import TagSelector from "@/components/chat/tag-selector/TagSelector";
import { Textarea } from "@/components/ui/textarea";
import useTagsStore from "@/store/tags";

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
  const { selectedTags, setSelectedTags } = useTagsStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSendMessage(input);
    setInput("");
  };

  const isEmpty = !input.trim();

  return (
    <div className="relative rounded-lg border bg-background p-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Message Input - Top Section */}
        <Textarea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          placeholder="有什么想问我的吗？比如：今天想吃什么？"
          className="min-h-[60px] h-[60px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
          enterKeyHint="enter"
        />

        {/* Bottom Section - Tags and Send Button */}
        <div className="flex justify-between items-center">
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            disabled={disabled}
          />

          {canAbort ? (
            <Button
              type="button"
              variant="destructive"
              onClick={onAbort}
              size="icon"
              className="h-8 w-8"
            >
              <Square size={18} fill="currentColor" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={disabled || isEmpty}
              size="icon"
              className="h-8 w-8"
            >
              <Send size={18} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
