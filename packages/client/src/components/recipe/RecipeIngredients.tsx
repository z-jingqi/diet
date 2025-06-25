import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import type { RecipeIngredient } from "@diet/shared";
import ExpandableCard from "./ExpandableCard";
import { Typography, MutedText } from "@/components/ui/typography";
import { Flame, Scale, Droplet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecipeIngredientsProps {
  ingredients: RecipeIngredient[];
}

const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  const handleCopyIngredients = () => {
    const text = ingredients.map((ing) => `${ing.name} ${ing.amount}${ing.unit}`).join("\n");
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
        {ingredients.map((ingredient, index) => (
          <div key={index} className="p-4 rounded-lg border space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Typography variant="h4" className="font-medium">{ingredient.name}</Typography>
                <MutedText>用量：{ingredient.amount}{ingredient.unit}</MutedText>
                <div className="mt-1">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {ingredient.price}元
                  </Badge>
                </div>
                {ingredient.purpose && <MutedText className="mt-1">用途：{ingredient.purpose}</MutedText>}
              </div>
            </div>
            
            {/* 营养成分信息 */}
            {ingredient.nutrition && (
              <div className="bg-muted/50 p-3 rounded-md">
                <Typography variant="span" className="font-medium mb-2 block">营养成分：</Typography>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <MutedText>{ingredient.nutrition.calories} kcal</MutedText>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-3 w-3 text-blue-500" />
                    <MutedText>{ingredient.nutrition.protein}g 蛋白质</MutedText>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-3 w-3 text-green-500" />
                    <MutedText>{ingredient.nutrition.potassium}mg 钾</MutedText>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-3 w-3 text-purple-500" />
                    <MutedText>{ingredient.nutrition.phosphorus}mg 磷</MutedText>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-3 w-3 text-red-500" />
                    <MutedText>{ingredient.nutrition.sodium}mg 钠</MutedText>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ExpandableCard title="食材清单" expandedContent={expandedContent}>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-start gap-2">
            <MutedText>{index + 1}.</MutedText>
            <div>
              <Typography variant="span">{ingredient.name}</Typography>
              <MutedText className="ml-2">{ingredient.amount}{ingredient.unit}</MutedText>
              {ingredient.purpose && <MutedText>{ingredient.purpose}</MutedText>}
            </div>
          </li>
        ))}
      </ul>
    </ExpandableCard>
  );
};

export default RecipeIngredients;
