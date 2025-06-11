import { Button } from '@/components/ui/Button';
import { Copy } from "lucide-react";
import type { RecipeIngredient } from '@/types/Recipe';
import ExpandableCard from "./expandable-card";

interface RecipeIngredientsProps {
  ingredients: RecipeIngredient[];
}

const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  const handleCopyIngredients = () => {
    const text = ingredients
      .map((ing) => `${ing.name} ${ing.amount}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  const expandedContent = (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleCopyIngredients();
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          复制食材清单
        </Button>
      </div>
      <div className="grid gap-4">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.order}
            className="flex items-start gap-4 p-4 rounded-lg border"
          >
            <div className="flex-1">
              <h4 className="font-medium">{ingredient.name}</h4>
              <p className="text-sm text-muted-foreground">
                用量：{ingredient.amount}
              </p>
              {ingredient.purpose && (
                <p className="text-sm text-muted-foreground mt-1">
                  用途：{ingredient.purpose}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="食材清单"
      expandedContent={expandedContent}
    >
      <ul className="space-y-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient.order} className="flex items-start gap-2">
            <span className="text-muted-foreground">{ingredient.order}.</span>
            <div>
              <span>{ingredient.name}</span>
              <span className="text-muted-foreground ml-2">
                {ingredient.amount}
              </span>
              {ingredient.purpose && (
                <p className="text-sm text-muted-foreground">
                  {ingredient.purpose}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </ExpandableCard>
  );
};

export default RecipeIngredients; 
