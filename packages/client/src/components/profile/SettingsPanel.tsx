import { Typography } from "@/components/ui/typography";
import { SettingGroup, SettingKey, SettingGroupTitle } from "./settings-config";
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
import { cn } from "../../lib/utils";
import { useSearch } from "@tanstack/react-router";

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
  const search = useSearch({ from: '/profile' });
  
  // Local state for favorites sub-view
  const [favoritesView, setFavoritesView] = React.useState<
    "menu" | "recipes" | "healthAdvice"
  >("menu");

  React.useEffect(() => {
    // Check if we need to restore favorites view from URL
    const urlSearch = search as any;
    if (group?.title === SettingGroupTitle.Favorites && urlSearch?.settingsView === 'recipes' && urlSearch?.from === 'settings') {
      setFavoritesView("recipes");
    } else {
      // Reset sub-view when group changes
      setFavoritesView("menu");
    }
  }, [group, search]);

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
    <div
      className={cn(
        "flex-1 min-h-0 space-y-6 overflow-y-auto p-6",
        !isMobile ? "max-w-[80rem] mx-auto" : ""
      )}
    >
      {children}
    </div>
  );

  const sectionClass = "shadow-none border-none";

  switch (group.title) {
    case SettingGroupTitle.General:
      return (
        <Wrapper>
          <ThemeSettings className={sectionClass} />
        </Wrapper>
      );
    case SettingGroupTitle.HealthAndNutrition:
      return (
        <Wrapper>
          <DietaryRestrictionsSettings className={sectionClass} />
          <CookingConstraintsSettings className={sectionClass} />
        </Wrapper>
      );
    case SettingGroupTitle.Preferences:
      return (
        <Wrapper>
          <TastePreferences className={sectionClass} />
          <CuisinePreferences className={sectionClass} />
          <FoodPreferences className={sectionClass} />
        </Wrapper>
      );
    case SettingGroupTitle.Favorites:
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
