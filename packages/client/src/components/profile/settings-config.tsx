import * as React from "react";
import {
  Palette,
  LogOut,
  Trash2,
  Heart,
} from "lucide-react";

export type SettingVariant = "default" | "danger";

// Keys enum for settings items
export enum SettingKey {
  Theme = "theme",
  FavoriteRecipes = "favoriteRecipes",
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
  Favorites = "我的菜谱",
  Account = "账户操作",
}

export const SETTING_LABELS: Record<SettingKey, string> = {
  [SettingKey.Theme]: "主题风格",
  [SettingKey.FavoriteRecipes]: "我的菜谱",
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
