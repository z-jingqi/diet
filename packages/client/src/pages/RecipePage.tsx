import { Button } from '@/components/ui/button';
import { ArrowLeft } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import useRecipeStore from '@/store/recipe-store';
import RecipeBasicInfo from '@/components/recipe/RecipeBasicInfo';
import RecipeIngredients from '@/components/recipe/RecipeIngredients';
import RecipeSteps from '@/components/recipe/RecipeSteps';
import RecipeNutrition from '@/components/recipe/RecipeNutrition';
import RecipeNotes from '@/components/recipe/RecipeNotes';
import useAuthStore from "@/store/auth-store";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, LogIn } from "lucide-react";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";

const RecipePage = () => {
  const { id } = useParams({ from: '/recipe/$id' });
  const authNavigate = useAuthNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setCurrentRecipeById, currentRecipe } = useRecipeStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast("请先登录后查看菜谱详情");
      authNavigate({ to: "/" });
      return;
    }

    if (id) {
      setCurrentRecipeById(id);
    }
  }, [id, isAuthenticated, setCurrentRecipeById, authNavigate]);

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col flex-1 min-h-0 p-4">
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle>需要登录</CardTitle>
              <CardDescription>
                请先登录后查看菜谱详情
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => authNavigate({ to: "/login" })}
              >
                <LogIn className="w-4 h-4 mr-2" />
                去登录
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentRecipe) {
    return (
      <div className="flex flex-col flex-1 min-h-0 p-4">
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>菜谱不存在</CardTitle>
              <CardDescription>
                未找到指定的菜谱
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => authNavigate({ to: "/" })}
              >
                返回首页
              </Button>
            </CardContent>
          </Card>
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
              onClick={() => authNavigate({ to: "/" })}
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
                <RecipeIngredients ingredients={currentRecipe.ingredients || []} />
              </div>
              
              {/* 烹饪步骤 */}
              <div className="xl:col-span-1">
                <RecipeSteps steps={currentRecipe.steps || []} />
              </div>
              
              {/* 营养信息 */}
              <div className="xl:col-span-1">
                {currentRecipe.nutrition && (
                  <RecipeNutrition nutrition={currentRecipe.nutrition} />
                )}
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
