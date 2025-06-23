import FunctionMenu from "@/components/profile/FunctionMenu";
import TastePreferences from "@/components/profile/TastePreferences";
import FoodPreferences from "@/components/profile/FoodPreferences";
import CuisinePreferences from "@/components/profile/CuisinePreferences";
import useAuthStore from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MutedText } from "@/components/ui/typography";
import { User, LogIn } from "lucide-react";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";

const ProfilePage = () => {
  const { isAuthenticated, isGuestMode } = useAuthStore();
  const authNavigate = useAuthNavigate();
  
  // 桌面端Card高度配置
  const desktopCardHeight = "lg:h-[600px] lg:flex lg:flex-col";

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col flex-1 min-h-0 p-4">
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle>未登录</CardTitle>
              <CardDescription>
                {isGuestMode 
                  ? "您当前处于游客模式，登录后可以使用更多功能" 
                  : "请登录后查看个人资料和偏好设置"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => authNavigate({ to: "/login" })}
              >
                <LogIn className="w-4 h-4 mr-2" />
                去登录
              </Button>
              {isGuestMode && (
                <MutedText className="text-center text-sm">
                  游客模式下只能使用聊天功能
                </MutedText>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 space-y-6">
      {/* 响应式网格布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        {/* 功能菜单 */}
        <FunctionMenu className={desktopCardHeight} />

        {/* 口味偏好 */}
        <TastePreferences className={desktopCardHeight} />

        {/* 菜系偏好 */}
        <CuisinePreferences className={desktopCardHeight} />

        {/* 食物偏好 */}
        <FoodPreferences className={desktopCardHeight} />
      </div>
    </div>
  );
};

export default ProfilePage;
