import { Markdown } from "@/components/ui/markdown";
import type { Recipe } from "@shared/schemas/recipe";
import RecipeCard from "./RecipeCard";
import { MutedText, ErrorText } from "@/components/ui/typography";

// 创建警告文本组件
const WarningText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-orange-600 dark:text-orange-400">{children}</span>
);

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
      <div className="w-full max-w-2xl">
        <div className="space-y-4">
          {status === 'pending' && recipes.length === 0 ? (
            <MutedText className="animate-pulse">生成菜谱中...</MutedText>
          ) : status === 'error' && recipes.length === 0 ? (
            <ErrorText>生成菜谱失败，请重试</ErrorText>
          ) : status === 'abort' && recipes.length === 0 ? (
            <WarningText>生成菜谱已中断</WarningText>
          ) : (
            <Markdown
              content={content}
              className="prose dark:prose-invert max-w-none bg-white rounded-lg p-4"
            />
          )}
          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.name}
                recipe={recipe}
                onCook={onRecipeClick}
                onLike={() => {
                  /* TODO: 实现点赞功能 */
                }}
                onDislike={() => {
                  /* TODO: 实现不喜欢功能 */
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
