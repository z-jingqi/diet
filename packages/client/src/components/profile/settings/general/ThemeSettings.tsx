import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Palette, Sun, Moon, Monitor } from "lucide-react";
import { MutedText } from "@/components/ui/typography";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme, ThemeOption } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeSettingsProps {
  className?: string;
}

const ThemeSettings = ({ className }: ThemeSettingsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Card className={cn("border", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          主题风格
        </CardTitle>
        <MutedText>选择应用的主题配色</MutedText>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={theme}
          onValueChange={(val: string) => setTheme(val as ThemeOption)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <label
              htmlFor="light"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sun className="h-4 w-4" />
              <span>浅色</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <label
              htmlFor="dark"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Moon className="h-4 w-4" />
              <span>深色</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <label
              htmlFor="system"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Monitor className="h-4 w-4" />
              <span>跟随系统</span>
            </label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
