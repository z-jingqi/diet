import { Utensils, Clock, Calendar, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";

interface RecipeBasicInfoProps {
  isLoading: boolean;
  recipe?: {
    servings?: number | null;
    difficulty?: string | null;
    costApprox?: number | null;
  } | null;
  totalTime: string;
}

const RecipeBasicInfo = ({ isLoading, recipe, totalTime }: RecipeBasicInfoProps) => {
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* 份量 */}
      <div className="flex flex-col items-center p-3 bg-muted/40 rounded-lg">
        <Utensils className="h-5 w-5 text-primary mb-1" />
        <Typography variant="span" className="text-xs text-muted-foreground">
          份量
        </Typography>
        <Typography variant="span" className="text-sm font-medium">
          {isLoading ? <Skeleton className="h-4 w-16" /> : `${recipe?.servings ?? 2}人份`}
        </Typography>
      </div>

      {/* 时间 */}
      <div className="flex flex-col items-center p-3 bg-muted/40 rounded-lg">
        <Clock className="h-5 w-5 text-primary mb-1" />
        <Typography variant="span" className="text-xs text-muted-foreground">
          烹饪时间
        </Typography>
        <Typography variant="span" className="text-sm font-medium">
          {isLoading ? <Skeleton className="h-4 w-16" /> : totalTime}
        </Typography>
      </div>

      {/* 难度 */}
      <div className="flex flex-col items-center p-3 bg-muted/40 rounded-lg">
        <Calendar className="h-5 w-5 text-primary mb-1" />
        <Typography variant="span" className="text-xs text-muted-foreground">
          难度
        </Typography>
        <Typography variant="span" className="text-sm font-medium">
          {isLoading ? <Skeleton className="h-4 w-16" /> : difficultyLabel()}
        </Typography>
      </div>

      {/* 费用 */}
      <div className="flex flex-col items-center p-3 bg-muted/40 rounded-lg">
        <DollarSign className="h-5 w-5 text-primary mb-1" />
        <Typography variant="span" className="text-xs text-muted-foreground">
          预估成本
        </Typography>
        <Typography variant="span" className="text-sm font-medium">
          {isLoading ? (
            <Skeleton className="h-4 w-16" />
          ) : recipe?.costApprox ? (
            `¥${recipe.costApprox}`
          ) : (
            "未知"
          )}
        </Typography>
      </div>
    </div>
  );
};

export default RecipeBasicInfo; 