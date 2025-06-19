import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ChefHat, Clock, DollarSign } from "lucide-react";
import type { Recipe } from "@shared/schemas/recipe";
import { cn } from "@/lib/utils";
import { MutedText } from "@/components/ui/typography";

const difficultyMap = {
  easy: { label: "简单", className: "bg-green-500" },
  medium: { label: "中等", className: "bg-yellow-500" },
  hard: { label: "困难", className: "bg-orange-500" },
  expert: { label: "专业", className: "bg-red-500" },
} as const;

interface RecipeCardProps {
  recipe: Recipe;
  onCook?: (recipe: Recipe) => void;
  onFavorite?: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onCook, onFavorite }: RecipeCardProps) => {
  const difficulty = difficultyMap[recipe.difficulty as keyof typeof difficultyMap] || {
    label: recipe.difficulty,
    className: "bg-gray-500"
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold leading-none tracking-tight">
          {recipe.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <DollarSign className="w-3 h-3 mr-1" />
            {recipe.cost}元
          </Badge>
          <Badge className={cn("text-white", difficulty.className)}>
            {difficulty.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <MutedText className="flex-1">
            烹饪时间：{recipe.cookingTime}分钟
          </MutedText>
        </div>
        {recipe.description && (
          <MutedText>
            {recipe.description}
          </MutedText>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFavorite?.(recipe)}
          className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
        >
          <Heart className="w-4 h-4 mr-1" />
          收藏
        </Button>
        <Button
          size="sm"
          onClick={() => onCook?.(recipe)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <ChefHat className="w-4 h-4 mr-1" />
          开始烹饪
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard; 
