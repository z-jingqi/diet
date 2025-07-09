import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { MutedText } from "@/components/ui/typography";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme, ThemeOption } from "@/hooks/useTheme";

interface ThemeSettingsProps {
  className?: string;
}

const ThemeSettings = ({ className }: ThemeSettingsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          主题风格
        </CardTitle>
        <MutedText>选择应用的主题配色</MutedText>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={theme}
          onValueChange={(val: string) => setTheme(val as ThemeOption)}
          className="flex flex-col gap-3"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="light" />
            浅色
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="dark" />
            深色
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="system" />
            跟随系统
          </label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
