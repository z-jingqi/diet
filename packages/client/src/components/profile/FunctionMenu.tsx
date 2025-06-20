import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography, MutedText } from "@/components/ui/typography";
import { useNavigate } from "react-router-dom";
import { Heart, XCircle, Utensils, Settings } from "lucide-react";

interface FunctionMenuProps {
  className?: string;
}

const FunctionMenu = ({ className }: FunctionMenuProps) => {
  const navigate = useNavigate();

  const handleFavorites = () => {
    // TODO: 实现收藏菜谱页面
    console.log("查看收藏菜谱");
  };

  const handleDisliked = () => {
    // TODO: 实现不喜欢的菜谱页面
    console.log("查看不喜欢的菜谱");
  };

  const handleKitchenTools = () => {
    navigate("/kitchen-tools");
  };

  const handleSettings = () => {
    // TODO: 实现设置页面
    console.log("设置");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-500" />
          功能菜单
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 lg:overflow-y-auto">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start h-14 px-4"
            onClick={handleFavorites}
          >
            <Heart className="w-5 h-5 mr-3 text-red-500" />
            <div className="flex flex-col items-start">
              <Typography variant="span" className="font-medium">
                我的收藏
              </Typography>
              <MutedText className="text-xs">收藏的菜谱</MutedText>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-14 px-4"
            onClick={handleDisliked}
          >
            <XCircle className="w-5 h-5 mr-3 text-gray-500" />
            <div className="flex flex-col items-start">
              <Typography variant="span" className="font-medium">
                不感兴趣
              </Typography>
              <MutedText className="text-xs">不喜欢的菜谱</MutedText>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-14 px-4"
            onClick={handleKitchenTools}
          >
            <Utensils className="w-5 h-5 mr-3 text-orange-500" />
            <div className="flex flex-col items-start">
              <Typography variant="span" className="font-medium">
                我的厨具
              </Typography>
              <MutedText className="text-xs">设置已拥有的厨具</MutedText>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-14 px-4"
            onClick={handleSettings}
          >
            <Settings className="w-5 h-5 mr-3 text-gray-500" />
            <div className="flex flex-col items-start">
              <Typography variant="span" className="font-medium">
                设置
              </Typography>
              <MutedText className="text-xs">应用设置</MutedText>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionMenu; 
