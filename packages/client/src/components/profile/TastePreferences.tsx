import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Typography, MutedText } from "@/components/ui/typography";
import { Flame, Droplet, Heart, Zap, Star, ChefHat, X } from "lucide-react";
import usePreferencesStore from "@/store/preferences";
import { tasteLabels, cuisineOptions, type TastePreference } from "@/data/taste-preferences";

const TastePreferences = () => {
  const { 
    tastePreferences, 
    updateTastePreference, 
    addCuisinePreference, 
    removeCuisinePreference 
  } = usePreferencesStore();

  const tasteIcons = {
    spiciness: Flame,
    saltiness: Droplet,
    sweetness: Heart,
    sourness: Zap,
    umami: Star,
  };

  const handleTasteChange = (key: keyof Omit<TastePreference, 'cuisine'>, value: number[]) => {
    updateTastePreference(key, value[0]);
  };

  const handleCuisineToggle = (cuisineId: string) => {
    if (tastePreferences.cuisine.includes(cuisineId)) {
      removeCuisinePreference(cuisineId);
    } else {
      addCuisinePreference(cuisineId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          口味偏好设置
        </CardTitle>
        <MutedText>
          调整您的口味偏好，AI将根据这些设置为您推荐更符合口味的菜谱
        </MutedText>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 口味维度设置 */}
        {Object.entries(tasteLabels).map(([key, label]) => {
          const Icon = tasteIcons[key as keyof typeof tasteIcons];
          const currentValue = tastePreferences[key as keyof Omit<TastePreference, 'cuisine'>];
          
          return (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <Typography variant="span" className="font-medium">
                    {label.name}
                  </Typography>
                </div>
                <MutedText className="text-sm">
                  {label.levels[currentValue]}
                </MutedText>
              </div>
              
              <Slider
                value={[currentValue]}
                onValueChange={(value) => handleTasteChange(key as keyof Omit<TastePreference, 'cuisine'>, value)}
                max={4}
                min={0}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                {label.levels.map((level, index) => (
                  <span key={index} className="text-center flex-1">
                    {level}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {/* 菜系偏好设置 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-muted-foreground" />
            <Typography variant="span" className="font-medium">
              菜系偏好
            </Typography>
          </div>
          
          <MutedText className="text-sm">
            选择您喜欢的菜系，AI将优先推荐这些菜系的菜谱
          </MutedText>
          
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => {
              const isSelected = tastePreferences.cuisine.includes(cuisine.id);
              return (
                <Badge
                  key={cuisine.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => handleCuisineToggle(cuisine.id)}
                >
                  {cuisine.name}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          
          {tastePreferences.cuisine.length === 0 && (
            <MutedText className="text-sm">
              暂未选择菜系偏好，将推荐各种菜系的菜谱
            </MutedText>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TastePreferences; 
