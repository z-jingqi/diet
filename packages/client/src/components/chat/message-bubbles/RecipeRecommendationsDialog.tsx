import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import RecipeRecommendationItem from "./RecipeRecommendationItem";
import { BasicRecipeInfo } from "@/types/recipe";
import { Utensils } from "lucide-react";

interface RecipeRecommendationsDialogProps {
  recipes: BasicRecipeInfo[];
  onGenerate?: (recipe: BasicRecipeInfo) => void;
  /** 是否禁用操作 */
  disabled?: boolean;
}

const RecipeRecommendationsDialog = ({
  recipes,
  onGenerate,
  disabled = false,
}: RecipeRecommendationsDialogProps) => {
  const [open, setOpen] = useState(false);

  if (!recipes.length) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          disabled={disabled}
        >
          <Utensils className="w-4 h-4" />
          <Typography variant="span" className="text-sm">
            生成详细菜谱
          </Typography>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] p-4 flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle>菜谱推荐</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-2">
          {recipes.map((recipe) => (
            <RecipeRecommendationItem
              key={recipe.id}
              recipe={recipe}
              onGenerate={(r) => {
                onGenerate?.(r);
                setOpen(false);
              }}
              disabled={disabled}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeRecommendationsDialog; 