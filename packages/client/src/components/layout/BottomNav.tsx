import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Heart, User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

// 底部/顶部导航组件（响应式）
const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 定义一级页面路径
  const tabPaths = ["/chat", "/favorites", "/profile"];
  const isTabPage = tabPaths.includes(location.pathname);

  // 如果不是一级页面，不显示导航
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
    <nav
      className={cn(
        // 移动端底部，桌面端顶部
        "fixed z-50 left-0 right-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "h-[var(--bottom-nav-height)] md:h-16",
        "bottom-0 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:shadow-sm"
      )}
    >
      <div
        className={cn(
          "grid h-full",
          // 移动端 3 列，桌面端居中横向排列
          "grid-cols-3 md:grid-cols-none md:flex md:justify-center md:items-center md:gap-12"
        )}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Button
              key={tab.path}
              variant="ghost"
              className={cn(
                // 移动端
                "flex flex-col items-center justify-center h-12 w-full rounded-none hover:bg-transparent gap-0.5 p-0",
                // 桌面端
                "md:flex-row md:h-20 md:w-auto md:px-8 md:rounded-b-lg md:rounded-t-none md:gap-3 md:font-semibold md:text-lg md:bg-transparent md:shadow-none md:border-none md:transition-colors",
                isActive && "text-primary"
              )}
              onClick={() => navigate(tab.path)}
            >
              {/* 图标：仅移动端显示 */}
              <tab.icon
                className={cn(
                  "h-5 w-5 transition-all duration-200 md:hidden",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 1.5 : 1}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground",
                  "md:text-lg md:font-semibold"
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
