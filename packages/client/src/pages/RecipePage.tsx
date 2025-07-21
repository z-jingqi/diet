import { useParams, useSearch } from "@tanstack/react-router";
import { useRecipeDetail } from "@/lib/gql/hooks/recipe-hooks";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useNavigate } from "@tanstack/react-router";

// 新拆分的组件
import RecipeHeader from "@/components/recipe/RecipeHeader";
import RecipeBasicInfo from "@/components/recipe/RecipeBasicInfo";
import RecipeIngredients from "@/components/recipe/RecipeIngredients";
import RecipeSteps from "@/components/recipe/RecipeSteps";
import RecipeNutrients from "@/components/recipe/RecipeNutrients";
import RecipeTips from "@/components/recipe/RecipeTips";

const RecipePage = () => {
  // 从URL获取菜谱ID
  const { id } = useParams({ from: "/recipe/$id" });
  const search = useSearch({ from: "/recipe/$id" });

  // 获取菜谱详情
  const { data: recipe, isLoading, error } = useRecipeDetail(id);

  // 解析菜谱数据
  const ingredients = recipe?.ingredientsJson
    ? JSON.parse(recipe.ingredientsJson)
    : [];
  const steps = recipe?.stepsJson ? JSON.parse(recipe.stepsJson) : [];
  const nutrients = recipe?.nutrientsJson
    ? JSON.parse(recipe.nutrientsJson)
    : {};

  // 计算总时间
  const totalTime = recipe?.totalTimeApproxMin
    ? `${Math.floor(recipe.totalTimeApproxMin / 60) > 0 ? `${Math.floor(recipe.totalTimeApproxMin / 60)}小时` : ""}${recipe.totalTimeApproxMin % 60 > 0 ? ` ${recipe.totalTimeApproxMin % 60}分钟` : ""}`
    : "未知";

  const navigate = useNavigate();

  const handleBack = () => {
    const urlSearch = search as any;
    if (
      urlSearch?.from === "settings" &&
      urlSearch?.settingsGroup &&
      urlSearch?.settingsView
    ) {
      // Navigate back to profile with settings state
      navigate({
        to: "/profile",
        search: {
          settingsGroup: urlSearch.settingsGroup,
          settingsView: urlSearch.settingsView,
          from: "settings",
        },
      });
    } else {
      // Default browser back behavior
      window.history.back();
    }
  };

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <Typography variant="h3" className="text-red-500 mb-4">
          菜谱加载失败
        </Typography>
        <Typography variant="p" className="mb-6">
          无法加载菜谱信息，请稍后再试
        </Typography>
        <Button asChild>
          <Link to="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 flex flex-col h-full">
      {/* 头部 */}
      <RecipeHeader isLoading={isLoading} recipe={recipe} onBack={handleBack} />

      <ScrollArea className="flex-1 overflow-y-auto pr-2 mt-4">

        <RecipeBasicInfo
          isLoading={isLoading}
          recipe={recipe}
          totalTime={totalTime}
        />

        <RecipeIngredients isLoading={isLoading} ingredients={ingredients} />

        <RecipeSteps isLoading={isLoading} steps={steps} />

        <RecipeNutrients nutrients={nutrients} />

        <RecipeTips tips={recipe?.tips} />

      {/* ScrollArea 结束 */}
      </ScrollArea>
    </div>
  );
};

export default RecipePage;
