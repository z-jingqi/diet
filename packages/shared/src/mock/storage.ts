import type { CustomRestriction, RecentView, SearchHistory } from '../types/storage';

// 搜索历史数据
export const mockSearchHistory: SearchHistory[] = [
  {
    query: "低钠食谱",
    timestamp: "2024-03-20T10:00:00",
    results: 5
  },
  {
    query: "高蛋白早餐",
    timestamp: "2024-03-20T09:30:00",
    results: 8
  }
];

// 最近查看数据
export const mockRecentViews: RecentView[] = [
  {
    name: "低钠鸡胸肉沙拉",
    description: "一道适合低钠饮食的健康沙拉",
    viewedAt: "2024-03-20T10:05:00",
    tags: ["低钠", "高蛋白"]
  }
];

// 自定义饮食限制数据
export const mockCustomRestrictions: CustomRestriction[] = [
  {
    name: "低钠饮食",
    reason: "高血压",
    description: "需要严格控制钠的摄入量",
    addedAt: "2024-03-19T00:00:00",
    level: "strict",
    relatedIngredients: ["盐", "酱油", "味精"],
    notes: "每日钠摄入量不超过2000mg"
  }
]; 
 