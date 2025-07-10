import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { MutedText } from "@/components/ui/typography";

interface FavoriteRecipesProps {
  className?: string;
}

const FavoriteRecipes = ({ className }: FavoriteRecipesProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          收藏的菜谱
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MutedText>这里将显示您收藏的菜谱列表（待实现）</MutedText>
      </CardContent>
    </Card>
  );
};

export default FavoriteRecipes;
