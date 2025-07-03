import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { TastePreference } from "@/data/taste-preferences";
import { defaultTastePreference } from "@/data/taste-preferences";

// 1. 定义状态接口
interface PreferencesState {
  // 口味偏好
  tastePreferences: TastePreference;
  // 食物偏好（不推荐的食物）
  dislikedFoods: string[]; // 存储食物名称
}

// 2. 定义行为接口
interface PreferencesActions {
  // 口味偏好操作
  setTastePreferences: (preferences: TastePreference) => void;
  updateTastePreference: (key: keyof TastePreference, value: number) => void;
  updateCuisinePreferences: (cuisines: string[]) => void;
  addCuisinePreference: (cuisineId: string) => void;
  removeCuisinePreference: (cuisineId: string) => void;

  // 食物偏好操作
  addDislikedFood: (foodName: string) => void;
  removeDislikedFood: (foodName: string) => void;
  setDislikedFoods: (foodNames: string[]) => void;
  isFoodDisliked: (foodName: string) => boolean;

  // 重置设置
  resetPreferences: () => void;
}

// 3. 合并完整的Store类型
export type PreferencesStore = PreferencesState & PreferencesActions;

// 4. 初始状态
const initialState: PreferencesState = {
  tastePreferences: defaultTastePreference,
  dislikedFoods: [],
};

// 5. 创建行为工厂函数 - 提供静态引用点
const createPreferencesActions = (set: any, get: any): PreferencesActions => ({
  // 口味偏好
  setTastePreferences: (preferences: TastePreference) => {
    set({ tastePreferences: preferences });
  },

  updateTastePreference: (key: keyof TastePreference, value: number) => {
    set((state: PreferencesState) => ({
      tastePreferences: {
        ...state.tastePreferences,
        [key]: value,
      },
    }));
  },

  updateCuisinePreferences: (cuisines: string[]) => {
    set((state: PreferencesState) => ({
      tastePreferences: {
        ...state.tastePreferences,
        cuisine: cuisines,
      },
    }));
  },

  addCuisinePreference: (cuisineId: string) => {
    set((state: PreferencesState) => ({
      tastePreferences: {
        ...state.tastePreferences,
        cuisine: state.tastePreferences.cuisine.includes(cuisineId)
          ? state.tastePreferences.cuisine
          : [...state.tastePreferences.cuisine, cuisineId],
      },
    }));
  },

  removeCuisinePreference: (cuisineId: string) => {
    set((state: PreferencesState) => ({
      tastePreferences: {
        ...state.tastePreferences,
        cuisine: state.tastePreferences.cuisine.filter(
          (id) => id !== cuisineId
        ),
      },
    }));
  },

  // 食物偏好
  addDislikedFood: (foodName: string) => {
    set((state: PreferencesState) => ({
      dislikedFoods: state.dislikedFoods.includes(foodName)
        ? state.dislikedFoods
        : [...state.dislikedFoods, foodName],
    }));
  },

  removeDislikedFood: (foodName: string) => {
    set((state: PreferencesState) => ({
      dislikedFoods: state.dislikedFoods.filter((name) => name !== foodName),
    }));
  },

  setDislikedFoods: (foodNames: string[]) => {
    set({ dislikedFoods: foodNames });
  },

  isFoodDisliked: (foodName: string) => {
    return get().dislikedFoods.includes(foodName);
  },

  // 重置设置
  resetPreferences: () => {
    set({
      tastePreferences: defaultTastePreference,
      dislikedFoods: [],
    });
  },
});

// 6. 创建选择器 - 提供更好的性能和引用追踪
export const preferencesSelectors = {
  // 状态选择器
  tastePreferences: (state: PreferencesStore) => state.tastePreferences,
  dislikedFoods: (state: PreferencesStore) => state.dislikedFoods,

  // 行为选择器
  setTastePreferences: (state: PreferencesStore) => state.setTastePreferences,
  updateTastePreference: (state: PreferencesStore) =>
    state.updateTastePreference,
  updateCuisinePreferences: (state: PreferencesStore) =>
    state.updateCuisinePreferences,
  addCuisinePreference: (state: PreferencesStore) => state.addCuisinePreference,
  removeCuisinePreference: (state: PreferencesStore) =>
    state.removeCuisinePreference,
  addDislikedFood: (state: PreferencesStore) => state.addDislikedFood,
  removeDislikedFood: (state: PreferencesStore) => state.removeDislikedFood,
  setDislikedFoods: (state: PreferencesStore) => state.setDislikedFoods,
  isFoodDisliked: (state: PreferencesStore) => state.isFoodDisliked,
  resetPreferences: (state: PreferencesStore) => state.resetPreferences,
};

// 7. 创建自定义Hook - 提供更好的封装和模块化
export const usePreferences = () => {
  const tastePreferences = usePreferencesStore(
    preferencesSelectors.tastePreferences
  );
  const dislikedFoods = usePreferencesStore(preferencesSelectors.dislikedFoods);

  const setTastePreferences = usePreferencesStore(
    preferencesSelectors.setTastePreferences
  );
  const updateTastePreference = usePreferencesStore(
    preferencesSelectors.updateTastePreference
  );
  const updateCuisinePreferences = usePreferencesStore(
    preferencesSelectors.updateCuisinePreferences
  );
  const addCuisinePreference = usePreferencesStore(
    preferencesSelectors.addCuisinePreference
  );
  const removeCuisinePreference = usePreferencesStore(
    preferencesSelectors.removeCuisinePreference
  );
  const addDislikedFood = usePreferencesStore(
    preferencesSelectors.addDislikedFood
  );
  const removeDislikedFood = usePreferencesStore(
    preferencesSelectors.removeDislikedFood
  );
  const setDislikedFoods = usePreferencesStore(
    preferencesSelectors.setDislikedFoods
  );
  const isFoodDisliked = usePreferencesStore(
    preferencesSelectors.isFoodDisliked
  );
  const resetPreferences = usePreferencesStore(
    preferencesSelectors.resetPreferences
  );

  return {
    // 状态
    tastePreferences,
    dislikedFoods,

    // 行为
    setTastePreferences,
    updateTastePreference,
    updateCuisinePreferences,
    addCuisinePreference,
    removeCuisinePreference,
    addDislikedFood,
    removeDislikedFood,
    setDislikedFoods,
    isFoodDisliked,
    resetPreferences,
  };
};

// 8. 创建Store
const usePreferencesStore = create<PreferencesStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      ...createPreferencesActions(set, get),
    }),
    {
      name: "preferences-store",
    }
  )
);

export default usePreferencesStore;
