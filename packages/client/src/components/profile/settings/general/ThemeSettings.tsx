import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { Typography, MutedText } from "@/components/ui/typography";

interface ThemeSettingsProps {
  className?: string;
}

const ThemeSettings = ({ className }: ThemeSettingsProps) => {
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
        <Typography variant="span" className="text-sm text-muted-foreground">
          TODO: 主题切换器占位
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
