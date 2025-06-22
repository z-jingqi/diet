import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography, MutedText } from "@/components/ui/typography";
import {
  ThumbsDown,
  ThumbsUp,
  Users,
  Utensils,
  ChefHat,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecipeDetail } from "@diet/shared";
import useAuthStore from "@/store/auth-store";
import { toast } from "sonner";

interface RecipeCardProps {
  recipeDetail: RecipeDetail;
  index: number;
  isLiked: boolean;
  isDisliked: boolean;
  isGenerating: boolean;
  onLike: (recipeName: string) => void;
  onDislike: (recipeName: string) => void;
  onGenerateRecipe: (recipeDetail: RecipeDetail) => Promise<void>;
  onStartCooking: (recipeId: string) => void;
}

const difficultyMap = {
  简单: { className: "bg-green-500" },
  中等: { className: "bg-yellow-500" },
  困难: { className: "bg-orange-500" },
} as const;

const RecipeCard = ({
  recipeDetail,
  index,
  isLiked,
  isDisliked,
  isGenerating,
  onLike,
  onDislike,
  onGenerateRecipe,
  onStartCooking,
}: RecipeCardProps) => {
  const { canUseFeatures } = useAuthStore();
  const difficulty = difficultyMap[
    recipeDetail.difficulty as keyof typeof difficultyMap
  ] || { className: "bg-gray-500" };
  const isGenerated = !!recipeDetail.generatedAt;

  const handleGenerateRecipe = async () => {
    if (!canUseFeatures()) {
      toast.error("请先登录后使用此功能", {
        description: "登录后可以生成详细菜谱",
        action: {
          label: "去登录",
          onClick: () => {
            // 这里可以添加导航到登录页的逻辑
            window.location.href = "/login";
          },
        },
      });
      return;
    }
    
    try {
      await onGenerateRecipe(recipeDetail);
      toast.success("菜谱生成成功！");
    } catch (error) {
      toast.error("菜谱生成失败", {
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    }
  };

  const handleStartCooking = () => {
    if (!canUseFeatures()) {
      toast.error("请先登录后使用此功能", {
        description: "登录后可以开始烹饪",
        action: {
          label: "去登录",
          onClick: () => {
            window.location.href = "/login";
          },
        },
      });
      return;
    }
    onStartCooking(recipeDetail?.recipeId ?? "");
    toast.success("开始烹饪！", {
      description: `正在准备 ${recipeDetail.name}`,
    });
  };

  return (
    <div
      key={`${recipeDetail.name}-${index}`}
      className="w-80 flex-shrink-0 border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
    >
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Typography
          variant="h5"
          className="leading-none tracking-tight text-gray-800"
        >
          {recipeDetail.name}
        </Typography>
        {recipeDetail.difficulty && (
          <Badge className={cn("text-white", difficulty.className)}>
            {recipeDetail.difficulty}
          </Badge>
        )}
      </div>
      {recipeDetail.cost && (
        <div className="pb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {recipeDetail.cost}
          </Badge>
        </div>
      )}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recipeDetail.servings && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-500" />
              <MutedText>{recipeDetail.servings}</MutedText>
            </div>
          )}
          {recipeDetail.tools && recipeDetail.tools !== "无" && (
            <div className="flex items-center">
              <Utensils className="w-4 h-4 mr-2 text-gray-500" />
              <MutedText>{recipeDetail.tools}</MutedText>
            </div>
          )}
        </div>
        {recipeDetail.features && (
          <MutedText className="leading-relaxed h-[50px] overflow-hidden">
            {recipeDetail.features}
          </MutedText>
        )}
      </div>
      <div className="flex justify-between items-center pt-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onLike(recipeDetail.name)}
            className={cn(
              "h-8 w-8 p-0",
              isLiked
                ? "text-green-600 bg-green-50"
                : "text-gray-500 hover:text-green-600"
            )}
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDislike(recipeDetail.name)}
            className={cn(
              "h-8 w-8 p-0",
              isDisliked
                ? "text-red-600 bg-red-50"
                : "text-gray-500 hover:text-red-600"
            )}
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
        {isGenerated ? (
          <Button
            size="sm"
            onClick={handleStartCooking}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <ChefHat className="w-4 h-4 mr-1" />
            开始烹饪
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleGenerateRecipe}
            disabled={isGenerating}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <ChefHat className="w-4 h-4 mr-1" />
            )}
            {isGenerating ? "生成中..." : "生成菜谱"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
