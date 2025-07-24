import { useState, ReactNode } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecipeRecommendationItem from "./RecipeRecommendationItem";
import RecipeSortToolbar, { SortConfig } from "./recipe-sort/RecipeSortToolbar";
import { BasicRecipeInfo } from "@/types/recipe";
import { Utensils } from "lucide-react";
import { useRecipeSort } from "@/hooks";

interface RecipeRecommendationsPopoverProps {
  recipes: BasicRecipeInfo[];
  children?: ReactNode;
}

const RecipeRecommendationsPopover = ({
  recipes,
  children,
}: RecipeRecommendationsPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    price: "default",
    time: "default",
    difficulty: "default",
    status: "default",
  });

  const sortedRecipes = useRecipeSort(recipes, sortConfig);

  // 关闭弹窗时重置排序状态
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSortConfig({
        price: "default",
        time: "default",
        difficulty: "default",
        status: "default",
      });
    }
  };

  if (!recipes.length) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Utensils className="w-4 h-4" />
            <Typography variant="span" className="text-sm">
              生成详细菜谱 ({recipes.length})
            </Typography>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-3 w-96 max-h-[60vh] flex flex-col">
        <Typography variant="h4" className="mb-2 text-base font-semibold flex-shrink-0">
          菜谱推荐
        </Typography>
        
        {/* 排序工具栏 */}
        <div className="flex-shrink-0">
          <RecipeSortToolbar onSortChange={setSortConfig} />
        </div>
        
        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-2">
            {sortedRecipes.map((recipe) => (
              <RecipeRecommendationItem key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default RecipeRecommendationsPopover;
