import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recipe } from "@/types/recipe";

interface RecipeNutritionProps {
  nutrition: Recipe["nutrition"];
}

const RecipeNutrition = ({ nutrition }: RecipeNutritionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>营养成分</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">蛋白质</p>
            <p className="text-2xl font-bold">{nutrition.totalProtein}g</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">卡路里</p>
            <p className="text-2xl font-bold">{nutrition.totalCalories}kcal</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">钾</p>
            <p className="text-2xl font-bold">{nutrition.totalPotassium}mg</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">磷</p>
            <p className="text-2xl font-bold">{nutrition.totalPhosphorus}mg</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">钠</p>
            <p className="text-2xl font-bold">{nutrition.totalSodium}mg</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeNutrition; 
