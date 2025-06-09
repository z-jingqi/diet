import type { Recipe } from "@/types/recipe";
import ExpandableCard from "./expandable-card";

interface RecipeNutritionProps {
  nutrition: Recipe["nutrition"];
}

const RecipeNutrition = ({ nutrition }: RecipeNutritionProps) => {
  const expandedContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border space-y-2">
          <p className="text-sm text-muted-foreground">蛋白质</p>
          <p className="text-2xl font-bold">{nutrition.totalProtein}g</p>
          <p className="text-sm text-muted-foreground">每日推荐摄入量：60g</p>
        </div>
        <div className="p-4 rounded-lg border space-y-2">
          <p className="text-sm text-muted-foreground">卡路里</p>
          <p className="text-2xl font-bold">{nutrition.totalCalories}kcal</p>
          <p className="text-sm text-muted-foreground">每日推荐摄入量：2000kcal</p>
        </div>
        <div className="p-4 rounded-lg border space-y-2">
          <p className="text-sm text-muted-foreground">钾</p>
          <p className="text-2xl font-bold">{nutrition.totalPotassium}mg</p>
          <p className="text-sm text-muted-foreground">每日推荐摄入量：3500mg</p>
        </div>
        <div className="p-4 rounded-lg border space-y-2">
          <p className="text-sm text-muted-foreground">磷</p>
          <p className="text-2xl font-bold">{nutrition.totalPhosphorus}mg</p>
          <p className="text-sm text-muted-foreground">每日推荐摄入量：700mg</p>
        </div>
        <div className="p-4 rounded-lg border space-y-2">
          <p className="text-sm text-muted-foreground">钠</p>
          <p className="text-2xl font-bold">{nutrition.totalSodium}mg</p>
          <p className="text-sm text-muted-foreground">每日推荐摄入量：2300mg</p>
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-muted">
        <h4 className="font-medium mb-2">营养建议</h4>
        <p className="text-sm text-muted-foreground">
          根据您的饮食需求，这道菜的营养成分较为均衡。建议搭配适量的蔬菜和主食，以确保营养的全面性。
        </p>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="营养成分"
      expandedContent={expandedContent}
    >
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
    </ExpandableCard>
  );
};

export default RecipeNutrition; 
