import { useState } from "react";
import { Markdown } from "@/components/ui/markdown";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Utensils } from "lucide-react";
import { ChatMessage, MessageStatus, MessageType } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";

interface StreamingRecipeMessageBubbleProps {
  message: ChatMessage;
  onGenerateRecipe?: (content: string) => void;
}

const RecipeMessageBubble = ({
  message,
  onGenerateRecipe,
}: StreamingRecipeMessageBubbleProps) => {
  const [generating, setGenerating] = useState(false);

  // 只处理 type 为 recipe 的消息
  if (message.type !== MessageType.Recipe) {
    return null;
  }

  const handleGenerateRecipe = () => {
    if (onGenerateRecipe && message.content) {
      setGenerating(true);
      onGenerateRecipe(message.content);
    }
  };

  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        <div className="bg-white rounded-lg p-4">
          {/* 菜谱内容 */}
          <div className="mb-4">
            <Markdown content={message.content || ""} className="max-w-none" />
          </div>

          {/* 生成菜谱按钮 - 只在消息完成后显示 */}
          {message.status === MessageStatus.Done && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateRecipe}
                disabled={generating}
                className={cn(
                  "flex items-center gap-1",
                  generating && "text-green-600"
                )}
              >
                <Utensils className="w-4 h-4" />
                <Typography variant="span" className="text-sm">
                  {generating ? "生成中..." : "生成详细菜谱"}
                </Typography>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeMessageBubble;
