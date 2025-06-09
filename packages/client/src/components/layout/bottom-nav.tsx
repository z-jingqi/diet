import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 底部导航组件
const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 定义一级页面路径
  const tabPaths = ["/chat", "/favorites", "/profile"];
  const isTabPage = tabPaths.includes(location.pathname);

  // 如果不是一级页面，不显示底部导航
  if (!isTabPage) {
    return null;
  }

  const tabs = [
    {
      name: "聊天",
      icon: MessageSquare,
      path: "/chat",
    },
    {
      name: "收藏",
      icon: Heart,
      path: "/favorites",
    },
    {
      name: "我的",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 h-[var(--bottom-nav-height)]">
      <div className="grid grid-cols-3 h-full">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Button
              key={tab.path}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-12 w-full rounded-none hover:bg-transparent gap-0.5 p-0",
                isActive && "text-primary"
              )}
              onClick={() => navigate(tab.path)}
            >
              <tab.icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 1.5 : 1}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.name}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
