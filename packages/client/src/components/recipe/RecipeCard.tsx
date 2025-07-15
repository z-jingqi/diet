import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Recipe } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  onClick?: (id: string) => void;
}

const RecipeCard = ({ recipe, className, onClick }: RecipeCardProps) => {
  const handleClick = () => {
    if (recipe.id && onClick) {
      onClick(recipe.id);
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-2 space-y-1">
        <Typography variant="h4" className="text-lg font-semibold truncate">
          {recipe.name}
        </Typography>
        {recipe.description && (
          <Typography
            variant="p"
            className="text-sm text-muted-foreground line-clamp-2"
          >
            {recipe.description}
          </Typography>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {recipe.cuisineType && <span>{recipe.cuisineType}</span>}
          {recipe.mealType && <span>{recipe.mealType}</span>}
          {recipe.difficulty && <span>{recipe.difficulty}</span>}
          {recipe.totalTimeApproxMin && (
            <span>{recipe.totalTimeApproxMin} 分钟</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard; 