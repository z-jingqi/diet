import { Typography } from "@/components/ui/typography";
import { SettingGroup, SettingKey } from "./settings-config";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ThemeSettings from "./settings/general/ThemeSettings";
import DietaryRestrictionsSettings from "./settings/health/DietaryRestrictionsSettings";
import CookingConstraintsSettings from "./settings/health/CookingConstraintsSettings";
import TastePreferences from "./settings/preferences/TastePreferences";
import CuisinePreferences from "./settings/preferences/CuisinePreferences";
import FoodPreferences from "./settings/preferences/FoodPreferences";
import FavoritesMenu from "./settings/favorites/FavoritesMenu";
import FavoriteRecipes from "./settings/favorites/FavoriteRecipes";
import FavoriteHealthAdvice from "./settings/favorites/FavoriteHealthAdvice";
import AccountActions from "./settings/account/AccountActions";

interface SettingsPanelProps {
  group: SettingGroup | null;
  onItemClick: (key: SettingKey) => void;
  inDrawer?: boolean;
}

const SettingsPanel = ({
  group,
  onItemClick,
  inDrawer = false,
}: SettingsPanelProps) => {
  // Local state for favorites sub-view
  const [favoritesView, setFavoritesView] = React.useState<
    "menu" | "recipes" | "healthAdvice"
  >("menu");

  React.useEffect(() => {
    // Reset sub-view when group changes
    setFavoritesView("menu");
  }, [group]);

  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Typography variant="span" className="text-muted-foreground">
          选择一个设置分类
        </Typography>
      </div>
    );
  }

  // Helper to wrap content with padding & scroll area
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div className="flex-1 min-h-0 p-6 space-y-6 overflow-y-auto">
      {children}
    </div>
  );

  const sectionClass = "shadow-none border-none";

  switch (group.title) {
    case "通用":
      return (
        <Wrapper>
          <ThemeSettings className={sectionClass} />
        </Wrapper>
      );
    case "健康与营养":
      return (
        <Wrapper>
          <DietaryRestrictionsSettings className={sectionClass} />
          <CookingConstraintsSettings className={sectionClass} />
        </Wrapper>
      );
    case "偏好设置":
      return (
        <Wrapper>
          <TastePreferences className={sectionClass} />
          <CuisinePreferences className={sectionClass} />
          <FoodPreferences className={sectionClass} />
        </Wrapper>
      );
    case "我的收藏":
      return (
        <Wrapper>
          {favoritesView !== "menu" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFavoritesView("menu")}
              className="mb-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {favoritesView === "menu" && (
            <FavoritesMenu
              className={sectionClass}
              onSelect={(key) => setFavoritesView(key)}
              hideTitle={inDrawer}
            />
          )}
          {favoritesView === "recipes" && (
            <FavoriteRecipes className={sectionClass} />
          )}
          {favoritesView === "healthAdvice" && (
            <FavoriteHealthAdvice className={sectionClass} />
          )}
        </Wrapper>
      );
    case "账户操作":
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
