import { Markdown } from "@/components/ui/markdown";
import { useMemo } from "react";
import { toast } from "sonner";
import { extractBasicRecipeInfos } from "@/utils/recipe-extractor";
import { BasicRecipeInfo } from "@/types/recipe";
import RecipeRecommendationsEntry from "./RecipeRecommendationsEntry";
import { ChatMessage, MessageStatus, MessageType } from "@/lib/gql/graphql";
import { useGenerateRecipe } from "@/lib/gql/hooks/recipe-hooks";

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

  // 使用生成菜谱的mutation - 必须在条件返回之前调用
  const { mutate: generateRecipe, isPending } = useGenerateRecipe();

  // 只处理 type 为 recipe 的消息
  if (message.type !== MessageType.Recipe) {
    return null;
  }

  // 处理生成菜谱
  const handleGenerate = (recipe: BasicRecipeInfo) => {
    toast.message(`正在生成「${recipe.name}」的详细菜谱...`, {
      duration: 3000
    });
    
    generateRecipe(recipe, {
      onError: (error) => {
        console.error("生成菜谱失败:", error);
        toast.error(`生成「${recipe.name}」详细菜谱失败，请稍后再试`);
      }
    });
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
                onGenerate={handleGenerate}
                disabled={isPending}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeMessageBubble;
