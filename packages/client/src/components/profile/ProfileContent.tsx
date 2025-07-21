import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";
import { settingsGroups, SettingKey, SettingGroupTitle } from "./settings-config";
import useMediaQuery from "@/hooks/useMediaQuery";
import SettingsDrawer from "./SettingsDrawer";
import SettingsPanel from "./SettingsPanel";
import { useLocation } from "@tanstack/react-router";

interface ProfileContentProps {
  className?: string;
}

const ProfileContent = ({ className }: ProfileContentProps) => {
  const { user, logout } = useAuth();
  const authNavigate = useAuthNavigate();
  const location = useLocation();
  
  // Only use search params if we're on the profile route
  const search = location.pathname === '/profile' ? location.search : {};

  // Display name logic
  const displayName = user?.nickname || user?.username || "访客";

  const isMobile = useMediaQuery("(max-width: 767px)");

  const [activeGroup, setActiveGroup] = React.useState<
    (typeof settingsGroups)[number] | null
  >(null);

  // Default select first group on desktop or restore from URL search params
  React.useEffect(() => {
    if (isMobile) {
      // On mobile, don't preselect
      setActiveGroup(null);
    } else if (!activeGroup) {
      // Check if we need to restore settings state from URL
      const urlSearch = search as any;
      if (urlSearch?.settingsGroup === 'favorites' && urlSearch?.from === 'settings') {
        const favoritesGroup = settingsGroups.find(g => g.title === SettingGroupTitle.Favorites);
        if (favoritesGroup) {
          setActiveGroup(favoritesGroup);
          return;
        }
      }
      // Desktop default selection
      setActiveGroup(settingsGroups[0]);
    }
  }, [isMobile, search]);

  // Click handler for settings item keys
  const handleSettingClick = async (key: SettingKey) => {
    switch (key) {
      case SettingKey.Logout:
        try {
          await logout();
          authNavigate({ to: "/login" });
        } catch (e) {
          console.error("Logout failed", e);
        }
        break;
      case SettingKey.DeleteAccount:
        if (confirm("确定要删除所有账号数据吗？此操作无法撤销？")) {
          // TODO: 调用删除账号接口
          console.log("Delete account - TODO");
        }
        break;
      default:
        console.log(`${key} clicked - TODO`);
    }
  };

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="flex items-center gap-4 py-6 px-4 lg:py-8 lg:px-6">
          <Avatar className="h-16 w-16 lg:h-24 lg:w-24 border-2 border-background">
            <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="text-lg lg:text-2xl font-bold bg-primary/10 text-primary">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Typography variant="h2" className="text-xl lg:text-2xl font-bold truncate">
              {displayName}
            </Typography>
          </div>
        </div>
      </div>

      {/* Body */}
      {isMobile ? (
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {settingsGroups.map((group) => (
            <Card
              key={group.title}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setActiveGroup(group)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex items-center justify-center w-10 h-10 rounded bg-muted">
                  <span className="text-foreground h-5 w-5">
                    {group.items[0]?.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <Typography variant="span" className="font-medium">
                    {group.title}
                  </Typography>
                  <Typography variant="span" className="text-muted-foreground text-sm block">
                    {group.items.length} 项设置
                  </Typography>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Drawer for second level */}
          <SettingsDrawer
            open={activeGroup !== null}
            group={activeGroup}
            onOpenChange={(open) => {
              if (!open) {
                setActiveGroup(null);
              }
            }}
            onItemClick={handleSettingClick}
          />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left category list */}
          <div className="w-64 p-2 overflow-y-auto space-y-1 flex flex-col border-r">
            {settingsGroups.map((group) => (
              <Button
                key={group.title}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-3",
                  activeGroup?.title === group.title && "bg-muted"
                )}
                onClick={() => setActiveGroup(group)}
              >
                <span className="mr-3 h-4 w-4">{group.items[0]?.icon}</span>
                <Typography variant="span" className="font-medium text-sm">
                  {group.title}
                </Typography>
              </Button>
            ))}
          </div>

          {/* Right panel */}
          <SettingsPanel
            group={activeGroup}
            isMobile={isMobile}
            onItemClick={handleSettingClick}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
