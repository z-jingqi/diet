import { Typography } from "@/components/ui/typography";
import RecipeCard from "./RecipeCard";
import type { RecipeDetail } from "@diet/shared";

interface RecipeListProps {
  recipeDetails: RecipeDetail[];
  likedRecipes: Set<string>;
  dislikedRecipes: Set<string>;
  generatingRecipes: Set<string>;
  onLike: (recipeName: string) => void;
  onDislike: (recipeName: string) => void;
  onGenerateRecipe: (recipeDetail: RecipeDetail) => Promise<void>;
  onStartCooking: (recipeId: string) => void;
}

const RecipeList = ({
  recipeDetails,
  likedRecipes,
  dislikedRecipes,
  generatingRecipes,
  onLike,
  onDislike,
  onGenerateRecipe,
  onStartCooking,
}: RecipeListProps) => {
  if (recipeDetails.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4">
        <Typography variant="h3" className="mb-4 text-gray-800">
          推荐菜谱
        </Typography>
        <div className="flex flex-wrap gap-4">
          {recipeDetails.map((recipeDetail, index) => {
            const isLiked = likedRecipes.has(recipeDetail.name);
            const isDisliked = dislikedRecipes.has(recipeDetail.name);
            const isGenerating = generatingRecipes.has(recipeDetail.id);

            return (
              <RecipeCard
                key={recipeDetail.id}
                recipeDetail={recipeDetail}
                index={index}
                isLiked={isLiked}
                isDisliked={isDisliked}
                isGenerating={isGenerating}
                onLike={onLike}
                onDislike={onDislike}
                onGenerateRecipe={onGenerateRecipe}
                onStartCooking={onStartCooking}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecipeList;
