import { Button } from '@/components/ui/button';
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useRecipeStore from '@/store/recipe-store';
import RecipeBasicInfo from '@/components/recipe/RecipeBasicInfo';
import RecipeIngredients from '@/components/recipe/RecipeIngredients';
import RecipeSteps from '@/components/recipe/RecipeSteps';
import RecipeNutrition from '@/components/recipe/RecipeNutrition';
import RecipeNotes from '@/components/recipe/RecipeNotes';

const RecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentRecipe, setCurrentRecipeById } = useRecipeStore();

  // 当组件加载时，根据ID设置当前菜谱
  useEffect(() => {
    if (id) {
      setCurrentRecipeById(id);
    }
  }, [id, setCurrentRecipeById]);

  // 如果ID不存在，显示错误页面
  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">菜谱ID不存在</h1>
          <p className="text-muted-foreground">请检查URL是否正确</p>
        </div>
      </div>
    );
  }

  // 如果菜谱不存在，显示错误页面
  if (!currentRecipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">菜谱不存在</h1>
          <p className="text-muted-foreground">未找到ID为 {id} 的菜谱</p>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            返回上一页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-background">
      {/* 顶部区域 */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold truncate">{currentRecipe.name}</h1>
          </div>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="h-full overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* 基本信息 */}
            <div className="mb-6">
              <RecipeBasicInfo recipe={currentRecipe} />
            </div>

            {/* 主要内容和营养信息 - 三列布局 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* 食材清单 */}
              <div className="xl:col-span-1">
                <RecipeIngredients ingredients={currentRecipe.ingredients} />
              </div>
              
              {/* 烹饪步骤 */}
              <div className="xl:col-span-1">
                <RecipeSteps steps={currentRecipe.steps} />
              </div>
              
              {/* 营养信息 */}
              <div className="xl:col-span-1">
                <RecipeNutrition nutrition={currentRecipe.nutrition} />
              </div>
            </div>

            {/* 注意事项卡片 */}
            {currentRecipe.dietNote && (
              <div className="mt-6">
                <RecipeNotes note={currentRecipe.dietNote} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
