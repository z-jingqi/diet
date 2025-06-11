import { Markdown } from '@/components/ui/Markdown';
import type { Recipe } from '@shared/types/recipe';
import RecipeQuickActionButton from '../RecipeQuickActionButton';
import { useEffect, useState } from 'react';

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
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // 每个字符的显示间隔

      return () => clearTimeout(timer);
    }
  }, [content, currentIndex]);

  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        <div className="bg-white rounded-lg p-4 space-y-4">
          <Markdown 
            content={displayedContent} 
            className="prose dark:prose-invert max-w-none" 
          />
          {currentIndex >= content.length && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeMessageBubble; 
