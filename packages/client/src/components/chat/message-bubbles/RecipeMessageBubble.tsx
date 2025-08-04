import { Markdown } from "@/components/ui/markdown";
import { useMemo } from "react";
import { extractBasicRecipeInfos } from "@/utils/recipe-extractor";
import RecipeRecommendationsEntry from "./RecipeRecommendationsEntry";
import { ChatMessage, MessageStatus, MessageType } from "@/lib/gql/graphql";

interface StreamingRecipeMessageBubbleProps {
  message: ChatMessage;
}

const RecipeMessageBubble = ({
  message,
}: StreamingRecipeMessageBubbleProps) => {
  // 提取菜谱基础信息
  const recipeInfos = useMemo(() => {
    if (message.status === MessageStatus.Done) {
      return extractBasicRecipeInfos(message.content || "");
    }
    return [];
  }, [message.content, message.status]);

  // 只处理 type 为 recipe 的消息
  if (message.type !== MessageType.Recipe) {
    return null;
  }

  return (
    <div className="flex w-full justify-start mb-4">
      <div className="bg-background rounded-lg w-full">
        {/* 菜谱内容 */}
        <div className="mb-3">
          <Markdown content={message.content || ""} className="max-w-none prose-sm" />
        </div>

        {/* 生成菜谱 Popover - 只在消息完成后显示 */}
        {message.status === MessageStatus.Done && recipeInfos.length > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-border/30">
            <RecipeRecommendationsEntry recipes={recipeInfos} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeMessageBubble;
