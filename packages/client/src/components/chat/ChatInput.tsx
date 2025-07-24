import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Square, Send } from "lucide-react";
import TagSelector from "@/components/chat/tag-selector/TagSelector";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (content: string, tagIds?: string[]) => void;
  disabled?: boolean;
  canAbort?: boolean;
  onAbort?: () => void;
  placeholder?: string;
}

const ChatInput = ({
  onSendMessage,
  disabled = false,
  canAbort = false,
  onAbort,
  placeholder = "输入消息...",
}: ChatInputProps) => {
  const [content, setContent] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
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
  }, [content]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || disabled) return;

    onSendMessage(
      content,
      selectedTagIds.length > 0 ? selectedTagIds : undefined
    );
    setContent("");
    // 保留已选标签，不需要清空
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!content.trim() || disabled) return;

      onSendMessage(
        content,
        selectedTagIds.length > 0 ? selectedTagIds : undefined
      );
      setContent("");
      // 保留已选标签，不需要清空
    }
  };

  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
  };

  const isEmpty = !content.trim();

  return (
    <div className="relative rounded-lg border bg-background p-2">
      <form onSubmit={handleSubmit}>
        {/* Message Input - Top Section */}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[40px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
          enterKeyHint="enter"
          rows={1}
        />

        {/* Bottom Section - Tags and Action Button */}
        <div className="flex justify-between items-center mt-4">
          <TagSelector
            selectedTagIds={selectedTagIds}
            onTagsChange={handleTagsChange}
            disabled={disabled}
          />

          <Button
            type={canAbort ? "button" : "submit"}
            onClick={canAbort ? onAbort : undefined}
            disabled={canAbort ? false : disabled || isEmpty}
            size="icon"
            className={canAbort ? "h-8 w-8 relative" : "h-8 w-8"}
          >
            {canAbort && (
              <div className="absolute top-0.5 left-0.5 w-7 h-7 rounded-full border-2 border-transparent border-r-white/70 animate-spin"></div>
            )}
            {canAbort ? <Square size={18} /> : <Send size={18} />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
