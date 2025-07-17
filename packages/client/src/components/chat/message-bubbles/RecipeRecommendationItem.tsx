import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ThumbsDown, Utensils, Clock, DollarSign, ChefHat } from "lucide-react";
import { BasicRecipeInfo } from "@/types/recipe";
import {
  useRecipePreferenceStatus,
  useSetRecipePreference,
  useGenerateRecipe,
} from "@/lib/gql/hooks/recipe-hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PreferenceType } from "@/lib/gql/graphql";
import { useMyRecipesQuery } from "@/lib/gql/graphql";
import { graphqlClient } from "@/lib/gql/client";
import { useNavigate } from "@tanstack/react-router";

interface RecipeRecommendationItemProps {
  recipe: BasicRecipeInfo;
}

const RecipeRecommendationItem = ({
  recipe,
}: RecipeRecommendationItemProps) => {
  // 获取菜谱喜好状态
  const { isDisliked, loading } = useRecipePreferenceStatus(recipe.name);

  // 设置菜谱喜好的mutation
  const { mutate: setPreference, isPending } = useSetRecipePreference();

  const navigate = useNavigate();

  // 我的菜谱列表，用于判断是否已生成
  const { data: myRecipesData } = useMyRecipesQuery(graphqlClient, {});

  const existingRecipe = myRecipesData?.myRecipes?.find(
    (r) => r?.name === recipe.name
  );

  // 生成菜谱 hook
  const { mutate: generateRecipe, isPending: isGenerating } =
    useGenerateRecipe();

  // 处理不喜欢
  const handleDislike = () => {
    if (loading || isPending || isDisliked) {
      return;
    }

    setPreference(
      { recipe, preference: PreferenceType.Dislike },
      {
        onSuccess: () => {
          toast.warning(`已标记不喜欢：${recipe.name}`);
        },
        onError: () => {
          toast.error("操作失败，请稍后再试");
        },
      }
    );
  };

  const handleGenerate = () => {
    if (isGenerating) {
      return;
    }

    generateRecipe(recipe, {
      onError: (error) => {
        console.error("生成菜谱失败:", error);
        toast.error(`生成「${recipe.name}」失败，请稍后再试`);
      },
    });
  };

  const handleView = () => {
    if (existingRecipe?.id) {
      navigate({ to: "/recipe/$id", params: { id: existingRecipe.id } });
    }
  };

  return (
    <div className="group relative flex flex-col gap-4 p-4 rounded-lg bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-border">
      {/* 菜谱名称 */}
      <div className="flex-1 min-w-0">
        <Typography variant="span" className="font-semibold text-base leading-tight text-foreground group-hover:text-primary transition-colors">
          {recipe.name}
        </Typography>
      </div>

      {/* 菜谱信息标签 */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
          <DollarSign className="h-3 w-3" />
          <span>{recipe.avgCost}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
          <Clock className="h-3 w-3" />
          <span>{recipe.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
          <ChefHat className="h-3 w-3" />
          <span>{recipe.difficulty}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/30">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 h-8 rounded-lg transition-all duration-200",
            isDisliked
              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              : "text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200"
          )}
          title="不喜欢"
          onClick={handleDislike}
          disabled={loading || isPending}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">不喜欢</span>
        </Button>
        
        <div className="flex-1" />
        
        {existingRecipe ? (
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1.5 px-4 py-2 h-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200"
            onClick={handleView}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">查看菜谱</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 h-8 rounded-lg border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm transition-all duration-200",
              isGenerating && "opacity-60 cursor-not-allowed animate-pulse"
            )}
            onClick={handleGenerate}
            disabled={isDisliked || isGenerating}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {isGenerating ? "生成中..." : "生成菜谱"}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeRecommendationItem;
