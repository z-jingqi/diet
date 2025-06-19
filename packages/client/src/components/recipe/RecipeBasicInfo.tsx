import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from "lucide-react";
import type { Recipe } from '@shared/schemas/recipe';
import { MutedText } from '@/components/ui/typography';

interface RecipeBasicInfoProps {
  recipe: Recipe;
}

const RecipeBasicInfo = ({ recipe }: RecipeBasicInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>基本信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{recipe.difficulty}</Badge>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <MutedText>{recipe.cookingTime}</MutedText>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <MutedText>{recipe.servings}人份</MutedText>
        </div>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeBasicInfo; 
