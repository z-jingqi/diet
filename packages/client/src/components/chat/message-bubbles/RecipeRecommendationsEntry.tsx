import useMediaQuery from "@/hooks/useMediaQuery";
import { BasicRecipeInfo } from "@/types/recipe";
import RecipeRecommendationsPopover from "./RecipeRecommendationsPopover";
import RecipeRecommendationsDialog from "./RecipeRecommendationsDialog";

interface RecipeRecommendationsEntryProps {
  recipes: BasicRecipeInfo[];
  /** 点击生成菜谱 */
  onGenerate?: (recipe: BasicRecipeInfo) => void;
  /** 是否禁用操作 */
  disabled?: boolean;
}

const RecipeRecommendationsEntry = ({
  recipes,
  onGenerate,
  disabled = false,
}: RecipeRecommendationsEntryProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!recipes.length) {
    return null;
  }

  return isMobile ? (
    <RecipeRecommendationsDialog
      recipes={recipes}
      onGenerate={onGenerate}
      disabled={disabled}
    />
  ) : (
    <RecipeRecommendationsPopover
      recipes={recipes}
      onGenerate={onGenerate}
      disabled={disabled}
    />
  );
};

export default RecipeRecommendationsEntry; 