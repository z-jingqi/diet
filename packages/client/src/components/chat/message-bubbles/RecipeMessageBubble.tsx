import { Markdown } from "@/components/ui/markdown";
import { RecipeDetail } from "@diet/shared";
import RecipeList from "./RecipeList";
import {
  useRecipeDetails,
  useRecipeContent,
  useRecipeDisplay,
  useRecipeInteractions,
} from "./hooks";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";
import { ChatMessage, MessageType } from "@/lib/gql/graphql";

interface StreamingRecipeMessageBubbleProps {
  message: ChatMessage;
  onLike?: (recipeName: string) => void;
  onDislike?: (recipeName: string) => void;
}

const RecipeMessageBubble = ({
  message,
  onLike,
  onDislike,
}: StreamingRecipeMessageBubbleProps) => {
  const authNavigate = useAuthNavigate();

  // 使用分离的 hooks
  const { recipeDetails } = useRecipeDetails({ message });
  const { beforeText, afterText } = useRecipeContent(message);
  const { showCards } = useRecipeDisplay(message, recipeDetails.length);
  const {
    likedRecipes,
    dislikedRecipes,
    generatingRecipes,
    handleLike,
    handleDislike,
    handleGenerateRecipe,
  } = useRecipeInteractions();

  // 只处理 type 为 recipe 的消息
  if (message.type !== MessageType.Recipe) {
    return null;
  }

  const handleLikeWithCallback = (recipeName: string) => {
    handleLike(recipeName);
    onLike?.(recipeName);
  };

  const handleDislikeWithCallback = (recipeName: string) => {
    handleDislike(recipeName);
    onDislike?.(recipeName);
  };

  // TODO: 需要把生成的菜谱和菜谱详情关联起来
  const handleGenerateRecipeWithUpdate = async (recipeDetail: RecipeDetail) => {
    await handleGenerateRecipe(recipeDetail);
  };

  const handleStartCooking = (recipeId: string) => {
    authNavigate({ to: `/recipe/${recipeId}` as any });
  };

  // 流式过程中显示 Markdown
  if (!showCards) {
    return (
      <div className="flex w-full justify-start">
        <div className="max-w-[80%]">
          <div className="bg-white rounded-lg p-4">
            <Markdown content={message.content || ""} className="max-w-none" />
          </div>
        </div>
      </div>
    );
  }

  // 流式结束后显示卡片
  return (
    <div className="flex w-full justify-start">
      <div className="w-full max-w-4xl">
        <div className="space-y-4">
          {/* 标签前的内容 */}
          {beforeText && (
            <div className="bg-white rounded-lg p-4">
              <Markdown content={beforeText} className="max-w-none" />
            </div>
          )}

          {/* 推荐菜谱列表 */}
          <RecipeList
            recipeDetails={recipeDetails}
            likedRecipes={likedRecipes}
            dislikedRecipes={dislikedRecipes}
            generatingRecipes={generatingRecipes}
            onLike={handleLikeWithCallback}
            onDislike={handleDislikeWithCallback}
            onGenerateRecipe={handleGenerateRecipeWithUpdate}
            onStartCooking={handleStartCooking}
          />

          {/* 标签后的内容 */}
          {afterText && (
            <div className="bg-white rounded-lg p-4">
              <Markdown content={afterText} className="max-w-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeMessageBubble;
