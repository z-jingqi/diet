import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { MutedText } from "@/components/ui/typography";

interface FavoriteHealthAdviceProps {
  className?: string;
}

const FavoriteHealthAdvice = ({ className }: FavoriteHealthAdviceProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-green-500" />
          收藏的健康建议
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MutedText>这里将显示您收藏的健康建议（待实现）</MutedText>
      </CardContent>
    </Card>
  );
};

export default FavoriteHealthAdvice;
