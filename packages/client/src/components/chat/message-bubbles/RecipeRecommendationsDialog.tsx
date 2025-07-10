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
import { BasicRecipeInfo } from "@/utils/recipe-extractor";
import { Utensils } from "lucide-react";

interface RecipeRecommendationsDialogProps {
  recipes: BasicRecipeInfo[];
}

const RecipeRecommendationsDialog = ({
  recipes,
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
      </DialogContent>
    </Dialog>
  );
};

export default RecipeRecommendationsDialog; 