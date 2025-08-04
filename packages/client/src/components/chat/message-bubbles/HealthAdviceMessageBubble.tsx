import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage, MessageStatus } from "@/lib/gql/graphql";

interface StreamingHealthMessageBubbleProps {
  message: ChatMessage;
  onSave?: (content: string) => void;
}

const HealthAdviceMessageBubble = ({
  message,
  onSave,
}: StreamingHealthMessageBubbleProps) => {
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(message.content || "");
  }, [message.content]);

  const handleSave = () => {
    if (onSave && content) {
      onSave(content);
      setSaved(true);
    }
  };

  return (
    <div className="flex w-full justify-start mb-4">
      <div className="bg-background rounded-lg w-full">
        {/* 健康建议内容 */}
        <div className="mb-3">
          <Markdown content={content} className="max-w-none prose-sm" />
        </div>

        {/* 操作按钮 - 只在生成完成后显示 */}
        {message.status === MessageStatus.Done && (
          <div className="flex items-center gap-2 pt-3 border-t border-border/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={saved}
              className={cn(
                "flex items-center gap-1 h-8 px-2 font-normal",
                saved && "text-green-600",
              )}
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="text-sm">
                {saved ? "已保存" : "保存建议"}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthAdviceMessageBubble;
