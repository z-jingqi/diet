import { Typography } from "@/components/ui/typography";

interface RecipeNutrientsProps {
  nutrients: Record<string, number> | null;
}

const RecipeNutrients = ({ nutrients }: RecipeNutrientsProps) => {
  if (!nutrients || Object.keys(nutrients).length === 0) {
    return null;
  }

  const nutrientMeta: Record<string, { label: string; unit?: string }> = {
    calories: { label: "热量", unit: "卡" },
    protein: { label: "蛋白质", unit: "g" },
    carbs: { label: "碳水", unit: "g" },
    fat: { label: "脂肪", unit: "g" },
    fiber: { label: "纤维", unit: "g" },
    sodium: { label: "钠", unit: "mg" },
    sugar: { label: "糖", unit: "g" },
  };

  return (
    <div className="mb-8">
      <Typography variant="h3" className="text-xl font-semibold mb-4">
        营养信息
      </Typography>

      <div className="bg-muted/20 rounded-lg p-3 flex flex-wrap gap-2 sm:gap-3">
        {Object.entries(nutrients).map(([key, value]) => {
          const meta = nutrientMeta[key] ?? ({ label: key } as any);
          const displayLabel = meta.unit
            ? `${meta.label} (${meta.unit})`
            : meta.label;
          return (
            <div
              key={key}
              className="flex flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-3 bg-background rounded-lg border border-muted/30 min-w-[72px]"
            >
              <Typography
                variant="span"
                className="text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap"
              >
                {displayLabel}
              </Typography>
              <Typography
                variant="p"
                className="text-base sm:text-lg font-bold leading-none"
              >
                {String(value)}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeNutrients;
