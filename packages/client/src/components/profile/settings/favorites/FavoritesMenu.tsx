import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Stethoscope } from "lucide-react";
import { Typography } from "@/components/ui/typography";

interface FavoritesMenuProps {
  className?: string;
  onSelect?: (key: "recipes" | "healthAdvice") => void;
  hideTitle?: boolean;
}

const FavoritesMenu = ({
  className,
  onSelect,
  hideTitle,
}: FavoritesMenuProps) => {
  return (
    <Card className={className}>
      {!hideTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            我的收藏
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-2"
          onClick={() => onSelect?.("recipes")}
        >
          <Heart className="w-4 h-4 mr-3 text-red-500" />
          <Typography variant="span" className="font-medium">
            菜谱
          </Typography>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-2"
          onClick={() => onSelect?.("healthAdvice")}
        >
          <Stethoscope className="w-4 h-4 mr-3 text-green-500" />
          <Typography variant="span" className="font-medium">
            健康建议
          </Typography>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FavoritesMenu;
