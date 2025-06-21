import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Typography, MutedText } from "@/components/ui/typography";
import { X, Plus, Utensils } from "lucide-react";
import usePreferencesStore from "@/store/preferences";

interface FoodPreferencesProps {
  className?: string;
}

const FoodPreferences = ({ className }: FoodPreferencesProps) => {
  const { dislikedFoods, addDislikedFood, removeDislikedFood } = usePreferencesStore();
  const [inputValue, setInputValue] = useState("");

  const handleAddFood = () => {
    const foodName = inputValue.trim();
    if (foodName && !dislikedFoods.includes(foodName)) {
      addDislikedFood(foodName);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddFood();
    }
  };

  const handleRemoveFood = (foodName: string) => {
    removeDislikedFood(foodName);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-red-500" />
          食物偏好设置
        </CardTitle>
        <MutedText>
          输入您不喜欢或不推荐的食物，AI将避免在菜谱中使用这些食材
        </MutedText>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 lg:overflow-y-auto">
        {/* 添加食物输入框 */}
        <div className="flex gap-2">
          <Input
            placeholder="输入食物名称，如：香菜、榴莲..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleAddFood}
            disabled={!inputValue.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 已选择的不推荐食物 */}
        {dislikedFoods.length > 0 ? (
          <div className="space-y-2">
            <Typography variant="span" className="text-sm font-medium">
              已设置的不推荐食物：
            </Typography>
            <div className="flex flex-wrap gap-2 mt-2">
              {dislikedFoods.map((foodName) => (
                <Badge
                  key={foodName}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {foodName}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => handleRemoveFood(foodName)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <MutedText className="text-sm">
            暂未设置不推荐的食物
          </MutedText>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodPreferences; 
