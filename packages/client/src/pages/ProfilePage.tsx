import ProfileContent from "@/components/profile/ProfileContent";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MutedText } from "@/components/ui/typography";
import { User, LogIn, ChevronLeft } from "lucide-react";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";
import { useNavigate } from "@tanstack/react-router";

const ProfilePage = () => {
  const { isAuthenticated, isGuestMode } = useAuth();
  const authNavigate = useAuthNavigate();
  const navigate = useNavigate();

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-dvh min-h-0 bg-background">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl font-semibold">未登录</CardTitle>
              <CardDescription className="mt-2">
                {isGuestMode
                  ? "您当前处于游客模式，登录后可以使用更多功能"
                  : "请登录后查看个人资料和偏好设置"}
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
                <MutedText className="text-center text-sm bg-muted p-3 rounded">
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
    <div className="flex flex-col h-dvh min-h-0 bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-base font-medium"
          onClick={() => navigate({ to: ".." })}
        >
          <ChevronLeft className="h-4 w-4" />
          个人中心
        </Button>
      </div>

      <ProfileContent className="flex-1" />
    </div>
  );
};

export default ProfilePage;
