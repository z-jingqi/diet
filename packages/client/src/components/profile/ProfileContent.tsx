import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";
import {
  settingsGroups,
  SettingKey,
  SettingGroupTitle,
} from "./settings-config";
import useMediaQuery from "@/hooks/useMediaQuery";
import SettingsDrawer from "./SettingsDrawer";
import SettingsPanel from "./SettingsPanel";
import { useLocation } from "@tanstack/react-router";

interface ProfileContentProps {
  className?: string;
}

const ProfileContent = ({ className }: ProfileContentProps) => {
  const { logout } = useAuth();
  const authNavigate = useAuthNavigate();
  const location = useLocation();

  // Only use search params if we're on the profile route
  const search = location.pathname === "/profile" ? location.search : {};

  const isMobile = useMediaQuery("(max-width: 767px)");

  const [activeGroup, setActiveGroup] = React.useState<
    (typeof settingsGroups)[number] | null
  >(null);

  // Default select first group on desktop or restore from URL search params
  React.useEffect(() => {
    const urlSearch = search as any;
    
    // Check if we need to restore settings state from URL (mobile and desktop)
    if (urlSearch?.settingsGroup === "favorites" && urlSearch?.from === "settings") {
      const favoritesGroup = settingsGroups.find(
        (g) => g.title === SettingGroupTitle.Favorites
      );
      if (favoritesGroup) {
        setActiveGroup(favoritesGroup);
        return;
      }
    }
    
    if (isMobile) {
      // On mobile, don't preselect unless returning from settings
      if (!urlSearch?.from) {
        setActiveGroup(null);
      }
    } else if (!activeGroup) {
      // Desktop default selection
      setActiveGroup(settingsGroups[0]);
    }
    // Desktop default selection
    setActiveGroup(settingsGroups[0]);
  }, [isMobile, search]);

  // Click handler for settings item keys
  const handleSettingClick = async (key: SettingKey) => {
    switch (key) {
      case SettingKey.FavoriteRecipes:
        if (isMobile) {
          authNavigate({ to: "/favorite-recipes" });
        }
        // On desktop, do nothing - the panel will show the content
        break;
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
    <div className={cn("flex flex-1 overflow-hidden", className)}>
      {isMobile ? (
        // Mobile: Clean list with drawer navigation
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-6 py-6">
            <div className="space-y-0.5">
              {settingsGroups.map((group) => (
                <button
                  key={group.title}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-left group"
                  onClick={() => {
                    if (group.title === SettingGroupTitle.Favorites && isMobile) {
                      authNavigate({ to: "/favorite-recipes" });
                    } else {
                      setActiveGroup(group);
                    }
                  }}
                >
                  <div className="flex items-center justify-center w-7 h-7">
                    <span className="text-muted-foreground h-3.5 w-3.5 flex items-center justify-center">
                      {group.items[0]?.icon}
                    </span>
                  </div>
                  <div className="font-medium text-sm truncate">
                    {group.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile drawer for settings */}
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
        // Desktop: Left sidebar + Right panel layout
        <div className="flex flex-1 overflow-hidden max-w-4xl mx-auto w-full">
          {/* Left sidebar */}
          <div className="w-56 px-6 py-6 overflow-y-auto border-r border-border/40">
            <div className="space-y-0.5">
              {settingsGroups.map((group) => (
                <Button
                  key={group.title}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-9 px-3 font-normal text-sm",
                    activeGroup?.title === group.title && "bg-muted/70"
                  )}
                  onClick={() => setActiveGroup(group)}
                >
                  <span className="mr-3 h-3.5 w-3.5 opacity-60">
                    {group.items[0]?.icon}
                  </span>
                  <span className="truncate">{group.title}</span>
                </Button>
              ))}
            </div>
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
