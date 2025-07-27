import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";

interface Ingredient {
  name: string;
  quantity?: string | number;
  amount?: string | number;
  unit?: string;
  note?: string;
  notes?: string;
}

interface RecipeIngredientsProps {
  isLoading: boolean;
  ingredients: Ingredient[];
}

const RecipeIngredients = ({
  isLoading,
  ingredients,
}: RecipeIngredientsProps) => {
  return (
    <div className="mb-8">
      <Typography variant="h3" className="text-xl font-semibold mb-4">
        食材
      </Typography>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-4">
          <ul className="space-y-2">
            {ingredients.map((ing, index) => (
              <li
                key={index}
                className="flex justify-between py-1 border-b border-dashed border-muted-foreground/20 last:border-0"
              >
                <span className="font-medium">{ing.name}</span>
                <div className="text-muted-foreground text-sm">
                  <span>
                    {ing.quantity ?? ing.amount}
                    {ing.unit ?? ""}
                  </span>
                  {(ing.note || ing.notes) && (
                    <span className="ml-2 text-xs">
                      ({ing.note || ing.notes})
                    </span>
                  )}
                </div>
              </li>
            ))}
            {ingredients.length === 0 && (
              <li className="text-center text-muted-foreground py-2">
                暂无食材信息
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeIngredients;
