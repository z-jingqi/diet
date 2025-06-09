import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import type { RecipeIngredient } from "@/types/recipe";

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>食材清单</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyIngredients}
          className="hover:bg-accent"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default RecipeIngredients; 
