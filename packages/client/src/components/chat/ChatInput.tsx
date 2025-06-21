import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Square, Send } from "lucide-react";
import TagSelector from "@/components/chat/tag-selector/TagSelector";
import { Textarea } from "@/components/ui/textarea";
import useChatStore from "@/store/chat-store";

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
  const { getCurrentSession, updateSessionTags } = useChatStore();
  const currentSession = getCurrentSession();
  const selectedTags = currentSession?.currentTags || [];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整textarea高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 重置高度以获取正确的scrollHeight
      textarea.style.height = "auto";
      // 设置新高度，但不超过最大高度
      const newHeight = Math.min(textarea.scrollHeight, 96);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || disabled) return;

      onSendMessage(input);
      setInput("");
    }
  };

  const handleTagsChange = (tags: any[]) => {
    updateSessionTags(tags);
  };

  const isEmpty = !input.trim();

  return (
    <div className="space-y-3">
      {/* 终止按钮 - 居中显示 */}
      {canAbort && (
        <div className="flex justify-center">
          <div className="relative">
            {/* 公转圆弧 */}
            <div className="absolute inset-0 w-6 h-6 rounded-full border-2 border-transparent border-t-primary/50 animate-spin"></div>
            {/* 终止按钮 */}
            <Button
              type="button"
              variant="ghost"
              onClick={onAbort}
              size="sm"
              className="relative h-6 w-6 rounded-full p-0 hover:bg-primary/10"
            >
              <Square size={12} className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* 输入框 */}
      <div className="relative rounded-lg border bg-background p-2">
        <form onSubmit={handleSubmit}>
          {/* Message Input - Top Section */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="有什么想问我的吗？比如：今天想吃什么？"
            className="min-h-[40px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
            enterKeyHint="enter"
            rows={1}
          />

          {/* Bottom Section - Tags and Send Button */}
          <div className="flex justify-between items-center mt-4">
            <TagSelector
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              disabled={disabled}
            />

            <Button
              type="submit"
              disabled={disabled || isEmpty}
              size="icon"
              className="h-8 w-8"
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
