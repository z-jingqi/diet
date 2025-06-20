import { ShoppingCart } from "lucide-react";
import { MutedText } from "@/components/ui/typography";
import type { RecipeIngredient } from "@shared/schemas/recipe";

interface IngredientsListProps {
  ingredients: RecipeIngredient[];
}

const IngredientsList = ({ ingredients }: IngredientsListProps) => {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <ShoppingCart className="w-4 h-4 mr-1" />
        <MutedText className="text-sm font-medium">
          需要食材：
        </MutedText>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-700">{ingredient.name}</span>
            <span className="text-gray-500">
              {ingredient.amount}{ingredient.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsList; 
