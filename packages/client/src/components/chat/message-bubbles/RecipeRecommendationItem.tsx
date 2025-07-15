import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ThumbsDown, Utensils } from "lucide-react";
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
    <div className="flex flex-col gap-2 p-3 md:p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
      {/* 基本信息 */}
      <div className="flex-1 min-w-0">
        <Typography variant="span" className="font-medium">
          {recipe.name}
        </Typography>
        <div className="text-xs text-muted-foreground mt-0.5 space-x-1 truncate">
          <span>{recipe.avgCost}</span>
          <span>|</span>
          <span>{recipe.duration}</span>
          <span>|</span>
          <span>{recipe.difficulty}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 mt-2 justify-end w-full">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 md:h-7 md:w-7",
            isDisliked
              ? "bg-red-100 text-red-600"
              : "text-red-600 hover:text-red-700"
          )}
          title="不喜欢"
          onClick={handleDislike}
          disabled={loading || isPending}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        {existingRecipe ? (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 h-9 md:h-7 text-primary hover:text-primary/80"
            onClick={handleView}
          >
            <Utensils className="h-4 w-4" />
            <span className="text-sm">查看菜谱</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1 px-3 h-9 md:h-7 text-primary hover:text-primary/80",
              isGenerating && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleGenerate}
            disabled={isDisliked || isGenerating}
          >
            <Utensils className="h-4 w-4" />
            <span className="text-sm">
              {isGenerating ? "生成中" : "生成菜谱"}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeRecommendationItem;
