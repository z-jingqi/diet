import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">
        食材
      </h3>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {ingredients.map((ing, index) => (
            <div
              key={index}
              className="flex justify-between py-2 border-b border-border/20 last:border-0"
            >
              <span className="font-medium text-sm">{ing.name}</span>
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
            </div>
          ))}
          {ingredients.length === 0 && (
            <div className="text-center text-muted-foreground py-4 text-sm">
              暂无食材信息
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeIngredients;
