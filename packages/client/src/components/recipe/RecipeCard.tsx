import React from "react";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/lib/gql/graphql";
import {
  cuisineTypeLabels,
  mealTypeLabels,
  difficultyLabels,
} from "@/data/recipe-mappings";
import { cn } from "@/lib/utils";
import { Star, Trash2, Clock, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  onClick?: (id: string) => void;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  selectable?: boolean;
  onDelete?: (id: string) => void;
  onStar?: (id: string, isStarred: boolean) => void;
  isStarred?: boolean;
}

const RecipeCard = ({
  recipe,
  className,
  onClick,
  isSelected = false,
  onSelectionChange,
  selectable = false,
  onDelete,
  onStar,
  isStarred = false,
}: RecipeCardProps) => {
  const handleClick = () => {
    if (recipe.id) {
      if (selectable && onSelectionChange) {
        // 选择模式下，点击卡片切换选择状态
        onSelectionChange(recipe.id, !isSelected);
      } else if (onClick) {
        // 非选择模式下，点击卡片跳转
        onClick(recipe.id);
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.id && onDelete) {
      onDelete(recipe.id);
    }
  };

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.id && onStar) {
      onStar(recipe.id, !isStarred);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer",
        selectable
          ? "border-border/60 hover:border-accent/60"
          : "border-border/40 hover:bg-muted/30",
        isSelected && "border-primary",
        className
      )}
      onClick={handleClick}
    >
      {/* Recipe name and main info */}
      <div className="flex-1 min-w-0 space-y-2 pr-16">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm truncate min-w-0 flex-1">
            {recipe.name}
          </h3>
          {/* Primary badges inline with title */}
          <div className="flex gap-1 shrink-0">
            {recipe.cuisineType && (
              <Badge variant="secondary" className="text-xs">
                {cuisineTypeLabels[recipe.cuisineType]}
              </Badge>
            )}
            {recipe.mealType && (
              <Badge variant="secondary" className="text-xs">
                {mealTypeLabels[recipe.mealType]}
              </Badge>
            )}
          </div>
        </div>

        {/* Secondary info with icons */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {recipe.difficulty && (
            <span className="flex items-center gap-1 shrink-0">
              <span className="opacity-60">难度</span>
              <Badge variant="outline" className="text-xs">
                {difficultyLabels[recipe.difficulty]}
              </Badge>
            </span>
          )}
          {recipe.totalTimeApproxMin && (
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3 opacity-60" />
              <span>{recipe.totalTimeApproxMin}分钟</span>
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1 shrink-0">
              <Users className="h-3 w-3 opacity-60" />
              <span>{recipe.servings}人份</span>
            </span>
          )}
          {recipe.costApprox && (
            <span className="flex items-center gap-1 shrink-0">
              <DollarSign className="h-3 w-3 opacity-60" />
              <span>¥{recipe.costApprox}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action area - top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        {selectable ? (
          /* Checkbox in selection mode */
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (recipe.id && onSelectionChange) {
                onSelectionChange(recipe.id, !!checked);
              }
            }}
            className="h-4 w-4"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          /* Action buttons - show on hover (desktop) or always (mobile) */
          (onDelete || onStar) && (
            <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {onStar && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 bg-background/80 backdrop-blur-sm hover:bg-background",
                    isStarred && "text-yellow-500 hover:text-yellow-600"
                  )}
                  onClick={handleStar}
                >
                  <Star
                    className="h-3 w-3"
                    fill={isStarred ? "currentColor" : "none"}
                  />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 bg-background/80 backdrop-blur-sm hover:bg-background hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
