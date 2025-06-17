import { FC } from "react";
import type { Recipe } from '@shared/schemas/recipe';
import { Eye, Heart, ChevronRight } from "lucide-react";
import { Button } from '@/components/ui/button';

interface RecipeQuickActionButtonProps {
  recipe: Recipe;
  onClick?: (recipe: Recipe) => void;
  onPreview?: (recipe: Recipe) => void;
  onFavorite?: (recipe: Recipe) => void;
}

const RecipeQuickActionButton: FC<RecipeQuickActionButtonProps> = ({
  recipe,
  onClick,
  onPreview,
  onFavorite,
}) => {
  return (
    <div className="flex w-full max-w-xs bg-orange-50 rounded-xl px-3 py-2 mb-2 items-start gap-2">
      <Button
        variant="ghost"
        className="flex-1 flex items-center border border-orange-200 rounded-lg px-3 py-2 font-semibold text-orange-900 text-base hover:bg-orange-100 active:bg-orange-200 active:scale-95 transition cursor-pointer break-words whitespace-normal min-h-[44px]"
        onClick={() => onClick?.(recipe)}
        type="button"
      >
        <span className="flex-1 text-left break-words whitespace-normal">{recipe.name}</span>
        <ChevronRight className="w-4 h-4 text-orange-300 ml-2 shrink-0" />
      </Button>
      <div className="flex flex-col gap-2 self-start mt-1">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 rounded-full bg-white hover:bg-orange-100"
          onClick={() => onPreview?.(recipe)}
          type="button"
          aria-label="预览"
        >
          <Eye className="w-4 h-4 text-orange-500" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 rounded-full bg-white hover:bg-orange-100"
          onClick={() => onFavorite?.(recipe)}
          type="button"
          aria-label="收藏"
        >
          <Heart className="w-4 h-4 text-orange-500" />
        </Button>
      </div>
    </div>
  );
};

export default RecipeQuickActionButton; 
