import { Markdown } from "@/components/ui/markdown";
import type { Recipe } from "@shared/schemas/recipe";
import RecipeQuickActionButton from "../RecipeQuickActionButton";

/**
 * 菜谱消息气泡
 */
const RecipeMessageBubble = ({
  content,
  recipes,
  status,
  onRecipeClick,
}: {
  content: string;
  recipes: Recipe[];
  status?: string;
  onRecipeClick?: (recipe: Recipe) => void;
}) => {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        <div className="bg-white rounded-lg p-4 space-y-4">
          {status === 'pending' && recipes.length === 0 ? (
            <div className="text-gray-400 animate-pulse">生成菜谱中...</div>
          ) : status === 'error' && recipes.length === 0 ? (
            <div className="text-red-500">生成菜谱失败，请重试</div>
          ) : (
            <Markdown
              content={content}
              className="prose dark:prose-invert max-w-none"
            />
          )}
          <div className="flex flex-wrap gap-2">
            {recipes.map((recipe) => (
              <RecipeQuickActionButton
                key={recipe.name}
                recipe={recipe}
                onClick={onRecipeClick}
                onPreview={() => {
                  /* TODO: 实现预览功能 */
                }}
                onFavorite={() => {
                  /* TODO: 实现收藏功能 */
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeMessageBubble;
