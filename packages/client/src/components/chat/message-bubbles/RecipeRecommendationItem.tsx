import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ThumbsDown, Utensils, Clock, DollarSign, ChefHat } from "lucide-react";
import { BasicRecipeInfo } from "@/types/recipe";
import {
  useRecipePreferenceStatus,
  useSetRecipePreference,
  useGenerateRecipe,
} from "@/lib/gql/hooks/recipe-hooks";
import { useRecipeGenerationStatus } from "@/hooks";
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
  const { mutate: generateRecipe } = useGenerateRecipe();

  // 使用全局状态管理生成状态
  const { isGenerating: getGeneratingStatus, setGenerating } =
    useRecipeGenerationStatus();
  const isCurrentlyGenerating = getGeneratingStatus(recipe.name);

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
    if (isCurrentlyGenerating) {
      return;
    }

    // 设置生成状态为true
    setGenerating(recipe.name, true);

    generateRecipe(recipe, {
      onSuccess: (result) => {
        // 生成成功后清除状态
        setGenerating(recipe.name, false);

        // 如果生成了菜谱，自动导航到菜谱详情页面
        if (result?.id) {
          navigate({ to: "/recipe/$id", params: { id: result.id } });
        }
      },
      onError: (error) => {
        // 生成失败后清除状态
        setGenerating(recipe.name, false);
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
    <div className="group relative flex flex-col gap-3 p-4 rounded-lg bg-card border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 hover:border-border">
      {/* 菜谱名称 */}
      <div className="flex-1 min-w-0">
        <Typography
          variant="span"
          className="font-medium text-base leading-tight text-foreground group-hover:text-primary transition-colors"
        >
          {recipe.name}
        </Typography>
      </div>

      {/* 菜谱信息标签 */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs font-medium">
          <span>{recipe.avgCost}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs font-medium">
          <Clock className="h-3 w-3" />
          <span>{recipe.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs font-medium">
          <ChefHat className="h-3 w-3" />
          <span>{recipe.difficulty}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1.5 px-2 py-1.5 h-7 rounded-md transition-all duration-200 text-xs",
            isDisliked
              ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
              : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          )}
          title="不喜欢"
          onClick={handleDislike}
          disabled={loading || isPending}
        >
          <ThumbsDown className="h-3 w-3" />
        </Button>

        <div className="flex-1" />

        {existingRecipe ? (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 px-3 py-1.5 h-7 text-foreground hover:text-primary transition-all duration-200 text-xs font-medium"
            onClick={handleView}
          >
            <Utensils className="h-3 w-3" />
            <span>查看菜谱</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-xs font-medium",
              isCurrentlyGenerating &&
                "opacity-60 cursor-not-allowed animate-pulse"
            )}
            onClick={handleGenerate}
            disabled={isDisliked || isCurrentlyGenerating}
          >
            <Utensils className="h-3 w-3" />
            <span>{isCurrentlyGenerating ? "生成中..." : "生成菜谱"}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeRecommendationItem;
