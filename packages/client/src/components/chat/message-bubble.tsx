import type { Message } from "@/types/chat";
import { Markdown } from "@/components/ui/markdown";
import type { Recipe } from "@/types/recipe";
import RecipeQuickActionButton from "./recipe-quick-action-button";

interface MessageBubbleProps {
  message: Message;
  onRecipeClick?: (recipe: Recipe) => void;
}

const MessageBubble = ({ message, onRecipeClick }: MessageBubbleProps) => {
  const isRecipe = message.type === "recipe";

  if (message.isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[80%] bg-[#e9e9e9]/80 rounded-lg">
          <p className="text-gray-900 p-2">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        {isRecipe ? (
          <div className="bg-white rounded-lg p-4 space-y-4">
            <Markdown 
              content={message.content} 
              className="prose dark:prose-invert max-w-none" 
            />
            <div className="flex flex-wrap gap-2">
              {message.recipes?.map((recipe) => (
                <RecipeQuickActionButton
                  key={recipe.id}
                  recipe={recipe}
                  onClick={onRecipeClick}
                  onPreview={() => {/* TODO: 实现预览功能 */}}
                  onFavorite={() => {/* TODO: 实现收藏功能 */}}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-2">
            <Markdown content={message.content} className="prose dark:prose-invert max-w-none" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble; 
