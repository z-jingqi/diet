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
import { useSearch } from "@tanstack/react-router";

interface ProfileContentProps {
  className?: string;
}

const ProfileContent = ({ className }: ProfileContentProps) => {
  const { user, logout } = useAuth();
  const authNavigate = useAuthNavigate();
  const search = useSearch({ from: '/profile' });

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
      <div className="flex flex-col items-center justify-center gap-4 py-6 lg:flex-row lg:justify-start lg:items-center lg:px-6 border-b">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
          <AvatarFallback className="text-xl font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Typography variant="h2" className="text-xl font-semibold">
          {displayName}
        </Typography>
      </div>

      {/* Body */}
      {isMobile ? (
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
          {settingsGroups.map((group) => (
            <Card
              key={group.title}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setActiveGroup(group)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <span className="text-primary h-6 w-6">
                  {group.items[0]?.icon}
                </span>
                <Typography variant="span" className="font-medium">
                  {group.title}
                </Typography>
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
                  "w-full justify-start h-12 px-2",
                  activeGroup?.title === group.title && "bg-muted"
                )}
                onClick={() => setActiveGroup(group)}
              >
                <span className="mr-3">{group.items[0]?.icon}</span>
                <Typography variant="span" className="font-medium">
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
