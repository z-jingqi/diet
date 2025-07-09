import * as React from "react";
import {
  Palette,
  AlertTriangle,
  Timer,
  Utensils,
  ChefHat,
  Pizza,
  LogOut,
  Trash2,
  Heart,
} from "lucide-react";

export type SettingVariant = "default" | "danger";

// Keys enum for settings items
export enum SettingKey {
  Theme = "theme",
  DietaryRestrictions = "dietaryRestrictions",
  CookingConstraints = "cookingConstraints",
  TastePreferences = "tastePreferences",
  CuisinePreferences = "cuisinePreferences",
  FoodPreferences = "foodPreferences",
  FavoriteRecipes = "favoriteRecipes",
  FavoriteHealthAdvice = "favoriteHealthAdvice",
  Logout = "logout",
  DeleteAccount = "deleteAccount",
}

export interface SettingItem {
  key: SettingKey;
  label: string;
  icon: React.ReactNode;
  variant?: SettingVariant;
}

export interface SettingGroup {
  title: string;
  items: SettingItem[];
}

export enum SettingGroupTitle {
  General = "通用",
  HealthAndNutrition = "健康与营养",
  Preferences = "偏好设置",
  Favorites = "我的收藏",
  Account = "账户操作",
}

export const SETTING_LABELS: Record<SettingKey, string> = {
  [SettingKey.Theme]: "主题风格",
  [SettingKey.DietaryRestrictions]: "饮食限制 / 过敏原",
  [SettingKey.CookingConstraints]: "烹饪条件",
  [SettingKey.TastePreferences]: "口味偏好",
  [SettingKey.CuisinePreferences]: "菜系偏好",
  [SettingKey.FoodPreferences]: "食物偏好",
  [SettingKey.FavoriteRecipes]: "我的收藏",
  [SettingKey.FavoriteHealthAdvice]: "我的健康建议收藏",
  [SettingKey.Logout]: "退出登录",
  [SettingKey.DeleteAccount]: "删除账号数据",
} as const;

export const settingsGroups: SettingGroup[] = [
  {
    title: SettingGroupTitle.General,
    items: [
      {
        key: SettingKey.Theme,
        label: SETTING_LABELS[SettingKey.Theme],
        icon: <Palette className="h-5 w-5" />,
      },
    ],
  },
  {
    title: SettingGroupTitle.HealthAndNutrition,
    items: [
      {
        key: SettingKey.DietaryRestrictions,
        label: SETTING_LABELS[SettingKey.DietaryRestrictions],
        icon: <AlertTriangle className="h-5 w-5" />,
      },
      {
        key: SettingKey.CookingConstraints,
        label: SETTING_LABELS[SettingKey.CookingConstraints],
        icon: <Timer className="h-5 w-5" />,
      },
    ],
  },
  {
    title: SettingGroupTitle.Preferences,
    items: [
      {
        key: SettingKey.TastePreferences,
        label: SETTING_LABELS[SettingKey.TastePreferences],
        icon: <Utensils className="h-5 w-5" />,
      },
      {
        key: SettingKey.CuisinePreferences,
        label: SETTING_LABELS[SettingKey.CuisinePreferences],
        icon: <ChefHat className="h-5 w-5" />,
      },
      {
        key: SettingKey.FoodPreferences,
        label: SETTING_LABELS[SettingKey.FoodPreferences],
        icon: <Pizza className="h-5 w-5" />,
      },
    ],
  },
  {
    title: SettingGroupTitle.Favorites,
    items: [
      {
        key: SettingKey.FavoriteRecipes,
        label: SETTING_LABELS[SettingKey.FavoriteRecipes],
        icon: <Heart className="h-5 w-5" />,
      },
    ],
  },
  {
    title: SettingGroupTitle.Account,
    items: [
      {
        key: SettingKey.Logout,
        label: SETTING_LABELS[SettingKey.Logout],
        icon: <LogOut className="h-5 w-5" />,
      },
      {
        key: SettingKey.DeleteAccount,
        label: SETTING_LABELS[SettingKey.DeleteAccount],
        icon: <Trash2 className="h-5 w-5" />,
        variant: "danger",
      },
    ],
  },
];
