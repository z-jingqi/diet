import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";
import { BasicRecipeInfo } from "@/types/recipe";
import RecipeRecommendationsPopover from "./message-bubbles/RecipeRecommendationsPopover";
import RecipeRecommendationsDialog from "./message-bubbles/RecipeRecommendationsDialog";
import useMediaQuery from "@/hooks/useMediaQuery";

interface FloatingRecipeButtonProps {
  recipes: BasicRecipeInfo[];
}

const FloatingRecipeButton = ({ recipes }: FloatingRecipeButtonProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!recipes.length) {
    return null;
  }

  const buttonElement = (
    <Button
      size="icon"
      className="w-10 h-10 rounded-full shadow-lg bg-primary hover:bg-primary/90"
    >
      <Utensils className="w-4 h-4" />
    </Button>
  );

  return isMobile ? (
    <RecipeRecommendationsDialog recipes={recipes}>
      {buttonElement}
    </RecipeRecommendationsDialog>
  ) : (
    <RecipeRecommendationsPopover recipes={recipes}>
      {buttonElement}
    </RecipeRecommendationsPopover>
  );
};

export default FloatingRecipeButton; 