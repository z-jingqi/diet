import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Square, Send, StopCircle } from "lucide-react";
import TagSelector from "@/components/chat/tag-selector/TagSelector";
import { Textarea } from "@/components/ui/textarea";
import useChatSessionStoreV2 from "@/store/chat-session-store-v2";
import { useTags } from "@/lib/gql/hooks";
import { Tag } from "@/lib/gql/graphql";
import { useChatSessionsV2 } from "@/lib/gql/hooks/chat-v2";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentSessionId, updateSessionTags } = useChatSessionStoreV2();
  const { data: tagsData } = useTags();
  const { sessions } = useChatSessionsV2();
  
  // 获取当前会话的标签
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const currentTagIds = currentSession?.tagIds || [];
  
  // 从所有标签中筛选出当前会话已选择的标签
  const selectedTags = (tagsData?.tags || [])
    .filter(tag => tag?.id && currentTagIds.includes(tag.id))
    .filter((tag): tag is Tag => tag !== null);

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

    onSendMessage(content);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!content.trim() || disabled) return;

      onSendMessage(content);
      setContent("");
    }
  };

  const handleTagsChange = (tags: Tag[]) => {
    if (currentSessionId) {
      updateSessionTags(currentSessionId, tags);
    }
  };

  const isEmpty = !content.trim();

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
              className="relative h-6 w-6 rounded-full p-0 hover:bg-primary/10 !px-[5px] !py-0"
            >
              <Square size={24} />
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

          {/* Bottom Section - Tags and Send Button */}
          <div className="flex justify-between items-center mt-4">
            <TagSelector
              selectedTagIds={selectedTags.map(tag => tag.id || "").filter(Boolean)}
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
