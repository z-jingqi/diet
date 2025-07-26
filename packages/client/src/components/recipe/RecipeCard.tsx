import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography, MutedText } from "@/components/ui/typography";
import { Recipe } from "@/lib/gql/graphql";
import {
  cuisineTypeLabels,
  mealTypeLabels,
  difficultyLabels,
} from "@/data/recipe-mappings";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  onClick?: (id: string) => void;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  selectable?: boolean;
}

const RecipeCard = ({
  recipe,
  className,
  onClick,
  isSelected = false,
  onSelectionChange,
  selectable = false,
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

  // 计算显示的badge数量
  const hasDifficulty = !!recipe.difficulty;
  const hasTime = !!recipe.totalTimeApproxMin;
  const hasServings = !!recipe.servings;
  const hasCost = !!recipe.costApprox;

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow relative",
        isSelected && "ring-2 ring-primary",
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-3 sm:p-4 pb-1">
        <Typography
          variant="h4"
          className="text-base sm:text-lg font-semibold truncate"
        >
          {recipe.name}
        </Typography>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {/* 主要标签：菜系和餐次 */}
          <div className="flex flex-wrap gap-1">
            {recipe.cuisineType && (
              <Badge variant="default" className="text-xs">
                {cuisineTypeLabels[recipe.cuisineType]}
              </Badge>
            )}
            {recipe.mealType && (
              <Badge variant="default" className="text-xs">
                {mealTypeLabels[recipe.mealType]}
              </Badge>
            )}
          </div>

          {/* 次要信息：难度、时间、份量、成本 */}
          {(hasDifficulty || hasTime || hasServings || hasCost) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              {recipe.difficulty && (
                <span className="inline-flex items-center">
                  <MutedText className="mr-2 text-xs">难度</MutedText>
                  <Badge variant="outline" className="text-xs">
                    {difficultyLabels[recipe.difficulty]}
                  </Badge>
                </span>
              )}
              {recipe.totalTimeApproxMin && (
                <span className="inline-flex items-center">
                  <MutedText className="mr-2 text-xs">时间</MutedText>
                  <Badge variant="outline" className="text-xs">
                    {recipe.totalTimeApproxMin}分钟
                  </Badge>
                </span>
              )}
              {recipe.servings && (
                <span className="inline-flex items-center">
                  <MutedText className="mr-2 text-xs">份量</MutedText>
                  <Badge variant="outline" className="text-xs">
                    {recipe.servings}人份
                  </Badge>
                </span>
              )}
              {recipe.costApprox && (
                <span className="inline-flex items-center">
                  <MutedText className="mr-2 text-xs">成本</MutedText>
                  <Badge variant="outline" className="text-xs">
                    ¥{recipe.costApprox}
                  </Badge>
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
