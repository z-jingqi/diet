import { Palette, Sun, Moon, Monitor } from "lucide-react";
import { MutedText } from "@/components/ui/typography";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme, ThemeOption } from "@/hooks/useTheme";

interface ThemeSettingsProps {
  className?: string;
}

const ThemeSettings = ({ className }: ThemeSettingsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">主题风格</h3>
          </div>
          <MutedText>选择应用的主题配色</MutedText>
        </div>
        
        <RadioGroup
          value={theme}
          onValueChange={(val: string) => setTheme(val as ThemeOption)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <label
              htmlFor="light"
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <Sun className="h-4 w-4" />
              <span>浅色</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <label
              htmlFor="dark"
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <Moon className="h-4 w-4" />
              <span>深色</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <label
              htmlFor="system"
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <Monitor className="h-4 w-4" />
              <span>跟随系统</span>
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ThemeSettings;
