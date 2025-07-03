import { create } from "zustand";
import type { TastePreference } from "@/data/taste-preferences";
import { defaultTastePreference } from "@/data/taste-preferences";

interface PreferencesState {
  // 口味偏好
  tastePreferences: TastePreference;
  setTastePreferences: (preferences: TastePreference) => void;
  updateTastePreference: (key: keyof TastePreference, value: number) => void;
  updateCuisinePreferences: (cuisines: string[]) => void;
  addCuisinePreference: (cuisineId: string) => void;
  removeCuisinePreference: (cuisineId: string) => void;

  // 食物偏好（不推荐的食物）
  dislikedFoods: string[]; // 存储食物名称
  addDislikedFood: (foodName: string) => void;
  removeDislikedFood: (foodName: string) => void;
  setDislikedFoods: (foodNames: string[]) => void;
  isFoodDisliked: (foodName: string) => boolean;

  // 重置设置
  resetPreferences: () => void;
}

const usePreferencesStore = create<PreferencesState>()((set, get) => ({
  // 口味偏好
  tastePreferences: defaultTastePreference,

  setTastePreferences: (preferences) => {
    set({ tastePreferences: preferences });
  },

  updateTastePreference: (key, value) => {
    set((state) => ({
      tastePreferences: {
        ...state.tastePreferences,
        [key]: value,
      },
    }));
  },

  updateCuisinePreferences: (cuisines) => {
    set((state) => ({
      tastePreferences: {
        ...state.tastePreferences,
        cuisine: cuisines,
      },
    }));
  },

  addCuisinePreference: (cuisineId) => {
    set((state) => ({
      tastePreferences: {
        ...state.tastePreferences,
        cuisine: state.tastePreferences.cuisine.includes(cuisineId)
          ? state.tastePreferences.cuisine
          : [...state.tastePreferences.cuisine, cuisineId],
      },
    }));
  },

  removeCuisinePreference: (cuisineId) => {
    set((state) => ({
      tastePreferences: {
        ...state.tastePreferences,
        cuisine: state.tastePreferences.cuisine.filter(
          (id) => id !== cuisineId
        ),
      },
    }));
  },

  // 食物偏好
  dislikedFoods: [],

  addDislikedFood: (foodName) => {
    set((state) => ({
      dislikedFoods: state.dislikedFoods.includes(foodName)
        ? state.dislikedFoods
        : [...state.dislikedFoods, foodName],
    }));
  },

  removeDislikedFood: (foodName) => {
    set((state) => ({
      dislikedFoods: state.dislikedFoods.filter((name) => name !== foodName),
    }));
  },

  setDislikedFoods: (foodNames) => {
    set({ dislikedFoods: foodNames });
  },

  isFoodDisliked: (foodName) => {
    return get().dislikedFoods.includes(foodName);
  },

  // 重置设置
  resetPreferences: () => {
    set({
      tastePreferences: defaultTastePreference,
      dislikedFoods: [],
    });
  },
}));

export default usePreferencesStore;
