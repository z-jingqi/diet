import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import RecipeRecommendationItem from "./RecipeRecommendationItem";
import { BasicRecipeInfo } from "@/utils/recipe-extractor";
import { Utensils } from "lucide-react";

interface RecipeRecommendationsPopoverProps {
  recipes: BasicRecipeInfo[];
}

const RecipeRecommendationsPopover = ({
  recipes,
}: RecipeRecommendationsPopoverProps) => {
  const [open, setOpen] = useState(false);

  if (!recipes.length) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
        >
          <Utensils className="w-4 h-4" />
          <Typography variant="span" className="text-sm">
            生成详细菜谱
          </Typography>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3 w-96 max-h-[60vh]">
        <Typography variant="h4" className="mb-2 text-base font-semibold">
          菜谱推荐
        </Typography>
        <div className="max-h-[50vh] overflow-y-auto space-y-2">
          {recipes.map((recipe) => (
            <RecipeRecommendationItem
              key={recipe.id}
              recipe={recipe}
              onLike={() => {
                // TODO: 处理喜欢逻辑
              }}
              onDislike={() => {
                // TODO: 处理不喜欢逻辑
              }}
              onGenerate={() => {
                // TODO: 生成该菜谱详细信息
                setOpen(false);
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RecipeRecommendationsPopover; 