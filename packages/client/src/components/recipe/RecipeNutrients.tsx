
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
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">
        补充营养信息
      </h3>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {Object.entries(nutrients).map(([key, value]) => {
          const meta = nutrientMeta[key] ?? ({ label: key } as any);
          return (
            <div
              key={key}
              className="flex items-baseline gap-1"
            >
              <span className="text-sm text-muted-foreground">
                {meta.label}
              </span>
              <span className="text-sm font-medium">
                {String(value)}{meta.unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeNutrients;
