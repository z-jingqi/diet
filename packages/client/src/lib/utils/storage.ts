import { STORAGE_KEYS, type SearchHistory, type FavoriteRecipe, type RecentView, type CustomRestriction } from '../../types/storage';

const MAX_SEARCH_HISTORY = 20;
const MAX_RECENT_VIEWS = 10;

export const storage = {
  // 搜索历史
  getSearchHistory: (): SearchHistory[] => {
    const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return history ? JSON.parse(history) : [];
  },

  addSearchHistory: (item: SearchHistory) => {
    const history = storage.getSearchHistory();
    history.unshift(item);
    if (history.length > MAX_SEARCH_HISTORY) {
      history.pop();
    }
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
  },

  clearSearchHistory: () => {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  },

  // 收藏菜谱
  getFavoriteRecipes: (): FavoriteRecipe[] => {
    const recipes = localStorage.getItem(STORAGE_KEYS.FAVORITE_RECIPES);
    return recipes ? JSON.parse(recipes) : [];
  },

  addFavoriteRecipe: (recipe: FavoriteRecipe) => {
    const recipes = storage.getFavoriteRecipes();
    recipes.push(recipe);
    localStorage.setItem(STORAGE_KEYS.FAVORITE_RECIPES, JSON.stringify(recipes));
  },

  removeFavoriteRecipe: (id: string) => {
    const recipes = storage.getFavoriteRecipes();
    const filtered = recipes.filter(recipe => recipe.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAVORITE_RECIPES, JSON.stringify(filtered));
  },

  // 最近查看
  getRecentViews: (): RecentView[] => {
    const views = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWS);
    return views ? JSON.parse(views) : [];
  },

  addRecentView: (view: RecentView) => {
    const views = storage.getRecentViews();
    const filtered = views.filter(v => v.id !== view.id);
    filtered.unshift(view);
    if (filtered.length > MAX_RECENT_VIEWS) {
      filtered.pop();
    }
    localStorage.setItem(STORAGE_KEYS.RECENT_VIEWS, JSON.stringify(filtered));
  },

  // 自定义禁忌
  getCustomRestrictions: (): CustomRestriction[] => {
    const restrictions = localStorage.getItem(STORAGE_KEYS.CUSTOM_RESTRICTIONS);
    return restrictions ? JSON.parse(restrictions) : [];
  },

  addCustomRestriction: (restriction: CustomRestriction) => {
    const restrictions = storage.getCustomRestrictions();
    restrictions.push(restriction);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_RESTRICTIONS, JSON.stringify(restrictions));
  },

  removeCustomRestriction: (id: string) => {
    const restrictions = storage.getCustomRestrictions();
    const filtered = restrictions.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_RESTRICTIONS, JSON.stringify(filtered));
  },

  // 清除所有数据
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}; 
