import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { Markdown } from "@/components/ui/markdown";

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
    <>
      {/* 返回按钮 */}
      <Button variant="ghost" className="mb-4" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      {/* 标题与描述 */}
      <div className="mb-8 flex items-start justify-between flex-col md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          {isLoading ? (
            <Skeleton className="h-10 w-3/4 mb-2" />
          ) : (
            <Typography variant="h2" className="text-2xl md:text-3xl font-bold">
              {recipe?.name ?? "加载中..."}
            </Typography>
          )}
          {isLoading ? (
            <Skeleton className="h-6 w-1/2" />
          ) : (
            <Markdown
              content={recipe?.description ?? ""}
              className="text-muted-foreground"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RecipeHeader; 