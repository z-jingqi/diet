import { Markdown } from "@/components/ui/markdown";
import { useMemo } from "react";
import { toast } from "sonner";
import { extractBasicRecipeInfos } from "@/utils/recipe-extractor";
import { BasicRecipeInfo } from "@/types/recipe";
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

  // 处理喜欢、不喜欢、生成菜谱等交互
  const handleLike = (recipe: BasicRecipeInfo) => {
    // TODO: 在此处调用后端接口或状态管理进行处理
    toast.success(`已标记喜欢：${recipe.name}`);
  };

  const handleDislike = (recipe: BasicRecipeInfo) => {
    // TODO: 在此处调用后端接口或状态管理进行处理
    toast.warning(`已标记不喜欢：${recipe.name}`);
  };

  const handleGenerate = (recipe: BasicRecipeInfo) => {
    // TODO: 在此处向聊天框发送生成菜谱的请求或其他逻辑
    toast.message(`正在生成「${recipe.name}」的详细菜谱…`);
  };

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
              <RecipeRecommendationsEntry
                recipes={recipeInfos}
                onLike={handleLike}
                onDislike={handleDislike}
                onGenerate={handleGenerate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeMessageBubble;
