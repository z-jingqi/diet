import useMediaQuery from "@/hooks/useMediaQuery";
import { BasicRecipeInfo } from "@/types/recipe";
import RecipeRecommendationsPopover from "./RecipeRecommendationsPopover";
import RecipeRecommendationsDialog from "./RecipeRecommendationsDialog";

interface RecipeRecommendationsEntryProps {
  recipes: BasicRecipeInfo[];
}

const RecipeRecommendationsEntry = ({
  recipes,
}: RecipeRecommendationsEntryProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!recipes.length) {
    return null;
  }

  return isMobile ? (
    <RecipeRecommendationsDialog recipes={recipes} />
  ) : (
    <RecipeRecommendationsPopover recipes={recipes} />
  );
};

export default RecipeRecommendationsEntry;
