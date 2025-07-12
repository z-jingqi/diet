import useMediaQuery from "@/hooks/useMediaQuery";
import { BasicRecipeInfo } from "@/types/recipe";
import RecipeRecommendationsPopover from "./RecipeRecommendationsPopover";
import RecipeRecommendationsDialog from "./RecipeRecommendationsDialog";

interface RecipeRecommendationsEntryProps {
  recipes: BasicRecipeInfo[];
  onLike?: (recipe: BasicRecipeInfo) => void;
  onDislike?: (recipe: BasicRecipeInfo) => void;
  onGenerate?: (recipe: BasicRecipeInfo) => void;
}

const RecipeRecommendationsEntry = ({
  recipes,
  onLike,
  onDislike,
  onGenerate,
}: RecipeRecommendationsEntryProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!recipes.length) {
    return null;
  }

  return isMobile ? (
    <RecipeRecommendationsDialog
      recipes={recipes}
      onLike={onLike}
      onDislike={onDislike}
      onGenerate={onGenerate}
    />
  ) : (
    <RecipeRecommendationsPopover
      recipes={recipes}
      onLike={onLike}
      onDislike={onDislike}
      onGenerate={onGenerate}
    />
  );
};

export default RecipeRecommendationsEntry; 