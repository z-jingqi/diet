import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Typography, MutedText } from "@/components/ui/typography";

interface DietaryRestrictionsSettingsProps {
  className?: string;
}

const DietaryRestrictionsSettings = ({
  className,
}: DietaryRestrictionsSettingsProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          饮食限制 / 过敏原
        </CardTitle>
        <MutedText>设置您的饮食禁忌或过敏原</MutedText>
      </CardHeader>
      <CardContent>
        <Typography variant="span" className="text-sm text-muted-foreground">
          TODO: 饮食限制配置占位
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DietaryRestrictionsSettings;
