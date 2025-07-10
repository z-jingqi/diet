import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ThumbsUp, ThumbsDown, Utensils } from "lucide-react";
import { BasicRecipeInfo } from "@/utils/recipe-extractor";

interface RecipeRecommendationItemProps {
  recipe: BasicRecipeInfo;
  /** 点击喜欢 */
  onLike?: (recipe: BasicRecipeInfo) => void;
  /** 点击不喜欢 */
  onDislike?: (recipe: BasicRecipeInfo) => void;
  /** 点击生成菜谱 */
  onGenerate?: (recipe: BasicRecipeInfo) => void;
}

const RecipeRecommendationItem = ({
  recipe,
  onLike,
  onDislike,
  onGenerate,
}: RecipeRecommendationItemProps) => {
  return (
    <div className="flex flex-col gap-2 p-3 md:p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
      {/* 基本信息 */}
      <div className="flex-1 min-w-0">
        <Typography variant="span" className="font-medium">
          {recipe.name}
        </Typography>
        <div className="text-xs text-muted-foreground mt-0.5 space-x-1 truncate">
          <span>{recipe.servings}</span>
          <span>|</span>
          <span>{recipe.cost}</span>
          <span>|</span>
          <span>{recipe.difficulty}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 mt-2 justify-end w-full">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:h-7 md:w-7 text-green-600 hover:text-green-700"
          title="喜欢"
          onClick={() => onLike?.(recipe)}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:h-7 md:w-7 text-red-600 hover:text-red-700"
          title="不喜欢"
          onClick={() => onDislike?.(recipe)}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-3 h-9 md:h-7 text-primary hover:text-primary/80"
          onClick={() => onGenerate?.(recipe)}
        >
          <Utensils className="h-4 w-4" />
          <span className="text-sm">生成菜谱</span>
        </Button>
      </div>
    </div>
  );
};

export default RecipeRecommendationItem; 