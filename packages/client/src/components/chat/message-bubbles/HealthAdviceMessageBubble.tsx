import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { Typography } from "@/components/ui/typography";
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
    <div className="flex w-full justify-start">
      <div className="bg-white rounded-lg p-4">
        {/* 健康建议内容 */}
        <div className="mb-4">
          <Markdown content={content} className="max-w-none" />
        </div>

        {/* 操作按钮 - 只在生成完成后显示 */}
        {message.status === MessageStatus.Done && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={saved}
              className={cn(
                "flex items-center gap-1",
                saved && "text-green-600",
              )}
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <Typography variant="span" className="text-sm">
                {saved ? "已保存" : "保存建议"}
              </Typography>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthAdviceMessageBubble;
