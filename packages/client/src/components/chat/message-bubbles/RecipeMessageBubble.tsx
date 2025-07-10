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
  // 只处理 type 为 recipe 的消息
  if (message.type !== MessageType.Recipe) {
    return null;
  }

  // 提取菜谱基础信息
  const recipeInfos = useMemo(() => {
    return extractBasicRecipeInfos(message.content || "");
  }, [message.content]);

  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        <div className="bg-white rounded-lg p-4">
          {/* 菜谱内容 */}
          <div className="mb-4">
            <Markdown content={message.content || ""} className="max-w-none" />
          </div>

          {/* 生成菜谱 Popover - 只在消息完成后显示 */}
          {message.status === MessageStatus.Done && recipeInfos.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <RecipeRecommendationsEntry recipes={recipeInfos} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeMessageBubble;
