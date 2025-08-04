import { Utensils, Clock, Calendar, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeBasicInfoProps {
  isLoading: boolean;
  recipe?: {
    servings?: number | null;
    difficulty?: string | null;
    costApprox?: number | null;
  } | null;
  totalTime: string;
}

const RecipeBasicInfo = ({
  isLoading,
  recipe,
  totalTime,
}: RecipeBasicInfoProps) => {
  const difficultyLabel = () => {
    if (!recipe?.difficulty) return "未知";
    switch (recipe.difficulty) {
      case "EASY":
        return "简单";
      case "MEDIUM":
        return "中等";
      case "HARD":
        return "困难";
      default:
        return "未知";
    }
  };

  return (
    <div className="flex flex-wrap gap-6 mb-6 pb-4 border-b border-border/40">
      {/* 份量 */}
      <div className="flex items-center gap-2">
        <Utensils className="h-4 w-4 text-muted-foreground" />
        <div className="space-y-0.5">
          <div className="text-xs text-muted-foreground">份量</div>
          <div className="text-sm font-medium">
            {isLoading ? (
              <Skeleton className="h-4 w-12" />
            ) : (
              `${recipe?.servings ?? 2}人份`
            )}
          </div>
        </div>
      </div>

      {/* 时间 */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="space-y-0.5">
          <div className="text-xs text-muted-foreground">烹饪时间</div>
          <div className="text-sm font-medium">
            {isLoading ? <Skeleton className="h-4 w-16" /> : totalTime}
          </div>
        </div>
      </div>

      {/* 难度 */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div className="space-y-0.5">
          <div className="text-xs text-muted-foreground">难度</div>
          <div className="text-sm font-medium">
            {isLoading ? <Skeleton className="h-4 w-12" /> : difficultyLabel()}
          </div>
        </div>
      </div>

      {/* 费用 */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <div className="space-y-0.5">
          <div className="text-xs text-muted-foreground">预估成本</div>
          <div className="text-sm font-medium">
            {isLoading ? (
              <Skeleton className="h-4 w-12" />
            ) : recipe?.costApprox ? (
              `¥${recipe.costApprox}`
            ) : (
              "未知"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeBasicInfo;
