export interface TastePreference {
  spiciness: number; // 辣度偏好 0-5
  saltiness: number; // 咸度偏好 0-5
  sweetness: number; // 甜度偏好 0-5
  sourness: number; // 酸度偏好 0-5
  umami: number; // 鲜度偏好 0-5
  cuisine: string[]; // 菜系偏好
}

export const defaultTastePreference: TastePreference = {
  spiciness: 2,
  saltiness: 3,
  sweetness: 2,
  sourness: 2,
  umami: 3,
  cuisine: [],
};

export const tasteLabels = {
  spiciness: {
    name: "辣度",
    levels: ["不辣", "微辣", "中辣", "重辣", "特辣"],
  },
  saltiness: {
    name: "咸度",
    levels: ["清淡", "偏淡", "适中", "偏咸", "重咸"],
  },
  sweetness: {
    name: "甜度",
    levels: ["无甜", "微甜", "适中", "偏甜", "很甜"],
  },
  sourness: {
    name: "酸度",
    levels: ["无酸", "微酸", "适中", "偏酸", "很酸"],
  },
  umami: {
    name: "鲜度",
    levels: ["清淡", "微鲜", "适中", "偏鲜", "很鲜"],
  },
};

export const cuisineOptions = [
  { id: "chinese", name: "中餐" },
  { id: "sichuan", name: "川菜" },
  { id: "cantonese", name: "粤菜" },
  { id: "shandong", name: "鲁菜" },
  { id: "jiangsu", name: "苏菜" },
  { id: "zhejiang", name: "浙菜" },
  { id: "fujian", name: "闽菜" },
  { id: "hunan", name: "湘菜" },
  { id: "anhui", name: "徽菜" },
  { id: "japanese", name: "日料" },
  { id: "korean", name: "韩料" },
  { id: "thai", name: "泰餐" },
  { id: "vietnamese", name: "越南菜" },
  { id: "indian", name: "印度菜" },
  { id: "italian", name: "意餐" },
  { id: "french", name: "法餐" },
  { id: "mediterranean", name: "地中海菜" },
  { id: "mexican", name: "墨西哥菜" },
  { id: "american", name: "美式" },
  { id: "western", name: "西餐" },
]; 
