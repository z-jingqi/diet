import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Flame, Scale } from "lucide-react";
import type { GeneratedRecipe } from '@diet/shared';
import { MutedText } from '@/components/ui/typography';

interface RecipeNutritionProps {
  nutrition?: GeneratedRecipe["nutrition"];
}

const RecipeNutrition = ({ nutrition }: RecipeNutritionProps) => {
  if (!nutrition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>营养成分</CardTitle>
        </CardHeader>
        <CardContent>
          <MutedText>暂无营养信息</MutedText>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>营养成分</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4" />
            <MutedText>{nutrition.calories} kcal</MutedText>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scale className="h-4 w-4" />
            <MutedText>{nutrition.protein}g 蛋白质</MutedText>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="h-4 w-4" />
            <MutedText>{nutrition.potassium}mg 钾</MutedText>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="h-4 w-4" />
            <MutedText>{nutrition.phosphorus}mg 磷</MutedText>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="h-4 w-4" />
            <MutedText>{nutrition.sodium}mg 钠</MutedText>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeNutrition; 
