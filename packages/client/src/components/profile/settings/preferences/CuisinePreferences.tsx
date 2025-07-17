import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MutedText } from "@/components/ui/typography";
import { ChefHat } from "lucide-react";
import { useState } from "react";
import { cuisineOptions } from "@/data/taste-preferences";

interface CuisinePreferencesProps {
  className?: string;
}

const CuisinePreferences = ({ className }: CuisinePreferencesProps) => {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const handleCuisineToggle = (cuisineId: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisineId)
        ? prev.filter((id) => id !== cuisineId)
        : [...prev, cuisineId]
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-blue-500" />
          菜系偏好设置
        </CardTitle>
        <MutedText>选择您喜欢的菜系，AI将优先推荐这些菜系的菜谱</MutedText>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 lg:overflow-y-auto">
        <div className="flex flex-wrap gap-3">
          {cuisineOptions.map((cuisine) => {
            const isSelected = selectedCuisines.includes(cuisine.id);
            return (
              <Badge
                key={cuisine.id}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-colors px-4 py-2 text-sm ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleCuisineToggle(cuisine.id)}
              >
                {cuisine.name}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CuisinePreferences;
