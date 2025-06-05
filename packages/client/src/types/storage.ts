/**
 * 本地存储的键名
 */
export const STORAGE_KEYS = {
  /** 搜索历史 */
  SEARCH_HISTORY: 'diet_search_history',
  /** 收藏的菜谱 */
  FAVORITE_RECIPES: 'diet_favorite_recipes',
  /** 最近查看 */
  RECENT_VIEWS: 'diet_recent_views',
  /** 自定义饮食限制 */
  CUSTOM_RESTRICTIONS: 'diet_custom_restrictions'
} as const;

/**
 * 搜索历史记录
 */
export interface SearchHistory {
  /** 搜索关键词 */
  query: string;
  /** 搜索时间 */
  timestamp: string;
  /** 搜索结果数量 */
  results: number;
}

/**
 * 收藏的菜谱
 */
export interface FavoriteRecipe {
  /** 菜谱ID */
  id: string;
  /** 菜谱名称 */
  name: string;
  /** 收藏时间 */
  savedAt: string;
  /** 收藏备注 */
  note?: string;
}

/**
 * 最近查看记录
 */
export interface RecentView {
  /** 菜谱ID */
  id: string;
  /** 菜谱名称 */
  name: string;
  /** 菜谱分类 */
  category: string;
  /** 查看时间 */
  viewedAt: string;
}

/**
 * 自定义饮食限制
 */
export interface CustomRestriction {
  /** 限制ID */
  id: string;
  /** 限制名称 */
  name: string;
  /** 限制原因 */
  reason: string;
  /** 添加时间 */
  addedAt: string;
} 
