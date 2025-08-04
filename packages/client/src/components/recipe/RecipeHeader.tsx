import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeHeaderProps {
  isLoading: boolean;
  recipe?: {
    name?: string | null;
    description?: string | null;
  } | null;
  onBack: () => void;
}

const RecipeHeader = ({ isLoading, recipe, onBack }: RecipeHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 -mx-2">
      <Button variant="ghost" size="sm" className="shrink-0" onClick={onBack}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        返回
      </Button>
      
      <div className="flex-1 min-w-0 ml-4 flex justify-end">
        {isLoading ? (
          <Skeleton className="h-6 w-full max-w-xs" />
        ) : (
          <h1 className="text-lg font-semibold text-right truncate max-w-full">
            {recipe?.name ?? "加载中..."}
          </h1>
        )}
      </div>
    </div>
  );
};

export default RecipeHeader;
