import { Markdown } from "@/components/ui/markdown";
import type { Recipe } from "@/types/recipe";
import RecipeQuickActionButton from "../recipe-quick-action-button";

/**
 * 菜谱消息气泡
 */
const RecipeMessageBubble = ({ 
  content, 
  recipes, 
  onRecipeClick 
}: { 
  content: string; 
  recipes: Recipe[]; 
  onRecipeClick?: (recipe: Recipe) => void;
}) => (
  <div className="flex w-full justify-start">
    <div className="max-w-[80%]">
      <div className="bg-white rounded-lg p-4 space-y-4">
        <Markdown 
          content={content} 
          className="prose dark:prose-invert max-w-none" 
        />
        <div className="flex flex-wrap gap-2">
          {recipes.map((recipe) => (
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
    </div>
  </div>
);

export default RecipeMessageBubble; 