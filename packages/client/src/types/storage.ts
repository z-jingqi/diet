export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'diet_search_history',
  FAVORITE_RECIPES: 'diet_favorite_recipes',
  RECENT_VIEWS: 'diet_recent_views',
  CUSTOM_RESTRICTIONS: 'diet_custom_restrictions'
} as const;

export interface SearchHistory {
  query: string;
  timestamp: string;
  results: number;
}

export interface FavoriteRecipe {
  id: string;
  name: string;
  savedAt: string;
  note?: string;
}

export interface RecentView {
  id: string;
  name: string;
  category: string;
  viewedAt: string;
}

export interface CustomRestriction {
  id: string;
  name: string;
  reason: string;
  addedAt: string;
} 
