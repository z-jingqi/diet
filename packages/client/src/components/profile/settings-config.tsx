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

export const settingsGroups: SettingGroup[] = [
  {
    title: "通用",
    items: [
      {
        key: SettingKey.Theme,
        label: "主题风格",
        icon: <Palette className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "健康与营养",
    items: [
      {
        key: SettingKey.DietaryRestrictions,
        label: "饮食限制 / 过敏原",
        icon: <AlertTriangle className="h-5 w-5" />,
      },
      {
        key: SettingKey.CookingConstraints,
        label: "烹饪条件",
        icon: <Timer className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "偏好设置",
    items: [
      {
        key: SettingKey.TastePreferences,
        label: "口味偏好",
        icon: <Utensils className="h-5 w-5" />,
      },
      {
        key: SettingKey.CuisinePreferences,
        label: "菜系偏好",
        icon: <ChefHat className="h-5 w-5" />,
      },
      {
        key: SettingKey.FoodPreferences,
        label: "食物偏好",
        icon: <Pizza className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "我的收藏",
    items: [
      {
        key: SettingKey.FavoriteRecipes,
        label: "我的收藏",
        icon: <Heart className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "账户操作",
    items: [
      {
        key: SettingKey.Logout,
        label: "退出登录",
        icon: <LogOut className="h-5 w-5" />,
      },
      {
        key: SettingKey.DeleteAccount,
        label: "删除账号数据",
        icon: <Trash2 className="h-5 w-5" />,
        variant: "danger",
      },
    ],
  },
];
