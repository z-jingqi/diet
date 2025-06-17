import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Flame, Scale } from "lucide-react";
import type { Recipe } from '@shared/schemas/recipe';

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
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4" />
            <span>{nutrition.totalCalories} kcal</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scale className="h-4 w-4" />
            <span>{nutrition.totalProtein}g 蛋白质</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="h-4 w-4" />
            <span>{nutrition.totalPotassium}mg 钾</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="h-4 w-4" />
            <span>{nutrition.totalPhosphorus}mg 磷</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="h-4 w-4" />
            <span>{nutrition.totalSodium}mg 钠</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeNutrition; 
