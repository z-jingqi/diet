import * as React from "react";
import {
  Palette,
  Target,
  Apple,
  AlertTriangle,
  Timer,
  Utensils,
  ChefHat,
  Pizza,
  Shield,
  ShieldCheck,
  LogOut,
  Trash2,
} from "lucide-react";

export type SettingVariant = "default" | "danger";

// Keys enum for settings items
export enum SettingKey {
  Theme = "theme",
  HealthGoals = "healthGoals",
  NutritionPreferences = "nutritionPreferences",
  DietaryRestrictions = "dietaryRestrictions",
  CookingConstraints = "cookingConstraints",
  TastePreferences = "tastePreferences",
  CuisinePreferences = "cuisinePreferences",
  FoodPreferences = "foodPreferences",
  PrivacyData = "privacyData",
  AccountSecurity = "accountSecurity",
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
        label: "主题设置",
        icon: <Palette className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "健康与营养",
    items: [
      {
        key: SettingKey.HealthGoals,
        label: "健康目标",
        icon: <Target className="h-5 w-5" />,
      },
      {
        key: SettingKey.NutritionPreferences,
        label: "营养偏好",
        icon: <Apple className="h-5 w-5" />,
      },
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
    title: "隐私与安全",
    items: [
      {
        key: SettingKey.PrivacyData,
        label: "隐私与数据",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        key: SettingKey.AccountSecurity,
        label: "账户安全",
        icon: <ShieldCheck className="h-5 w-5" />,
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
