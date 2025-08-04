import { SettingGroup, SettingKey, SettingGroupTitle } from "./settings-config";
import React from "react";
import ThemeSettings from "./settings/general/ThemeSettings";
import FavoriteRecipes from "./settings/favorites/FavoriteRecipes";
import AccountActions from "./settings/account/AccountActions";

interface SettingsPanelProps {
  group: SettingGroup | null;
  onItemClick: (key: SettingKey) => void;
  inDrawer?: boolean;
  isMobile?: boolean;
}

const SettingsPanel = ({
  group,
  onItemClick,
  inDrawer = false,
  isMobile = false,
}: SettingsPanelProps) => {
  // No sub views for favorites now

  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="text-muted-foreground text-sm">
            选择一个设置分类
          </span>
        </div>
      </div>
    );
  }

  // Helper to wrap content with padding & scroll area
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
      {children}
    </div>
  );

  const sectionClass = "shadow-none border-none p-0";

  switch (group.title) {
    case SettingGroupTitle.General:
      return (
        <Wrapper>
          <ThemeSettings className={sectionClass} />
        </Wrapper>
      );
    case SettingGroupTitle.Favorites:
      return (
        <Wrapper>
          <FavoriteRecipes className={sectionClass} />
        </Wrapper>
      );
    case SettingGroupTitle.Account:
      return (
        <Wrapper>
          <AccountActions
            className={sectionClass}
            onLogout={() => onItemClick(SettingKey.Logout)}
            onDelete={() => onItemClick(SettingKey.DeleteAccount)}
            hideTitle={inDrawer}
          />
        </Wrapper>
      );
    default:
      return null;
  }
};

export default SettingsPanel;
