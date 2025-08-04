import ProfileContent from "@/components/profile/ProfileContent";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MutedText } from "@/components/ui/typography";
import { User, LogIn, ChevronLeft } from "lucide-react";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";
import { useNavigate } from "@tanstack/react-router";

const ProfilePage = () => {
  const { isAuthenticated, isGuestMode, user } = useAuth();
  const authNavigate = useAuthNavigate();
  const navigate = useNavigate();

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-dvh min-h-0 bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">未登录</h2>
              <p className="text-muted-foreground">
                {isGuestMode
                  ? "您当前处于游客模式，登录后可以使用更多功能"
                  : "请登录后查看个人资料和偏好设置"}
              </p>
            </div>
            <div className="space-y-4">
              <Button
                variant="default"
                className="w-full"
                onClick={() => authNavigate({ to: "/login" })}
              >
                <LogIn className="w-4 h-4 mr-2" />
                去登录
              </Button>
              {isGuestMode && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <MutedText className="text-center">
                    游客模式下只能使用聊天功能
                  </MutedText>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-sm font-normal -ml-2"
          onClick={() => navigate({ to: ".." })}
        >
          <ChevronLeft className="h-4 w-4" />
          个人中心
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user?.avatarUrl || undefined}
            alt={user?.nickname || user?.username || "访客"}
          />
          <AvatarFallback className="text-xs font-medium bg-muted text-muted-foreground">
            {(user?.nickname || user?.username || "访客")
              .charAt(0)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <ProfileContent className="flex-1" />
    </div>
  );
};

export default ProfilePage;
