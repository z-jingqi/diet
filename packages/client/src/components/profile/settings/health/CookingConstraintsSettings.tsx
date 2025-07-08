import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { Typography, MutedText } from "@/components/ui/typography";

interface CookingConstraintsSettingsProps {
  className?: string;
}

const CookingConstraintsSettings = ({
  className,
}: CookingConstraintsSettingsProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-blue-500" />
          烹饪条件
        </CardTitle>
        <MutedText>配置可用时间或厨房设备等限制</MutedText>
      </CardHeader>
      <CardContent>
        <Typography variant="span" className="text-sm text-muted-foreground">
          TODO: 烹饪条件配置占位
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CookingConstraintsSettings;
