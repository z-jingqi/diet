import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Typography, MutedText } from "@/components/ui/typography";
import { Flame, Droplet, Heart, Zap, Star } from "lucide-react";
import usePreferencesStore from "@/store/preferences-store";
import { tasteLabels, type TastePreference } from "@/data/taste-preferences";

interface TastePreferencesProps {
  className?: string;
}

const TastePreferences = ({ className }: TastePreferencesProps) => {
  const { 
    tastePreferences, 
    updateTastePreference
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          口味偏好设置
        </CardTitle>
        <MutedText>
          调整您的口味偏好，AI将根据这些设置为您推荐更符合口味的菜谱
        </MutedText>
      </CardHeader>
      <CardContent className="space-y-14 flex-1 lg:overflow-y-auto">
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
                <Typography variant="span" className="text-xs bg-muted px-2 py-1 rounded-md">
                  {label.levels[currentValue]}
                </Typography>
              </div>
              
              <Slider
                value={[currentValue]}
                onValueChange={(value) => handleTasteChange(key as keyof Omit<TastePreference, 'cuisine'>, value)}
                max={4}
                min={0}
                step={1}
                className="w-full"
              />
              
              <div className="relative w-full">
                {label.levels.map((level, index) => (
                  <div
                    key={index}
                    className="absolute transform -translate-x-1/2"
                    style={{
                      left: index === 0 ? 'calc(0% + var(--spacing) * 3)' : 
                           index === label.levels.length - 1 ? 'calc(100% - var(--spacing) * 3)' : 
                           `${(index / (label.levels.length - 1)) * 100}%`,
                    }}
                  >
                    <MutedText className="text-xs text-center whitespace-nowrap">
                      {level}
                    </MutedText>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TastePreferences; 
