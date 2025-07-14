import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ThumbsDown, Utensils } from "lucide-react";
import { BasicRecipeInfo } from "@/types/recipe";
import { useRecipePreferenceStatus, useSetRecipePreference } from "@/lib/gql/hooks/recipe-hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PreferenceType } from "@/lib/gql/graphql";

interface RecipeRecommendationItemProps {
  recipe: BasicRecipeInfo;
  /** 点击生成菜谱 */
  onGenerate?: (recipe: BasicRecipeInfo) => void;
  /** 是否禁用所有操作 */
  disabled?: boolean;
}

const RecipeRecommendationItem = ({
  recipe,
  onGenerate,
  disabled = false,
}: RecipeRecommendationItemProps) => {
  // 获取菜谱喜好状态
  const { isDisliked, loading } = useRecipePreferenceStatus(recipe.name);
  
  // 设置菜谱喜好的mutation
  const { mutate: setPreference, isPending } = useSetRecipePreference();

  // 处理不喜欢
  const handleDislike = () => {
    if (loading || isPending || disabled) return;
    
    // 如果已经不喜欢，则不做任何操作
    if (isDisliked) return;
    
    setPreference(
      { recipe, preference: PreferenceType.Dislike },
      {
        onSuccess: () => {
          toast.warning(`已标记不喜欢：${recipe.name}`);
        },
        onError: () => {
          toast.error("操作失败，请稍后再试");
        }
      }
    );
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
            isDisliked ? "bg-red-100 text-red-600" : "text-red-600 hover:text-red-700"
          )}
          title="不喜欢"
          onClick={handleDislike}
          disabled={loading || isPending || disabled}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-3 h-9 md:h-7 text-primary hover:text-primary/80"
          onClick={() => onGenerate?.(recipe)}
          disabled={isDisliked || disabled} // 如果用户不喜欢，或整体禁用时，禁用生成按钮
        >
          <Utensils className="h-4 w-4" />
          <span className="text-sm">生成菜谱</span>
        </Button>
      </div>
    </div>
  );
};

export default RecipeRecommendationItem; 