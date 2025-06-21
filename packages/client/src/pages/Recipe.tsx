import { Button } from '@/components/ui/button';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useRecipeStore from '@/store/recipe';
import RecipeBasicInfo from '@/components/recipe/RecipeBasicInfo';
import RecipeIngredients from '@/components/recipe/RecipeIngredients';
import RecipeSteps from '@/components/recipe/RecipeSteps';
import RecipeNutrition from '@/components/recipe/RecipeNutrition';
import RecipeNotes from '@/components/recipe/RecipeNotes';

const RecipePage = () => {
  const navigate = useNavigate();
  const currentRecipe = useRecipeStore((state) => state.currentRecipe);

  if (!currentRecipe) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">菜谱不存在</h1>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh]">
      {/* 顶部区域 */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{currentRecipe.name}</h1>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="container mx-auto p-4 space-y-6">
        {/* 卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecipeBasicInfo recipe={currentRecipe} />
          <RecipeIngredients ingredients={currentRecipe.ingredients} />
          <RecipeSteps steps={currentRecipe.steps} />
          <RecipeNutrition nutrition={currentRecipe.nutrition} />
        </div>

        {/* 注意事项卡片 */}
        {currentRecipe.dietNote && (
          <RecipeNotes note={currentRecipe.dietNote} />
        )}
      </div>
    </div>
  );
};

export default RecipePage;
