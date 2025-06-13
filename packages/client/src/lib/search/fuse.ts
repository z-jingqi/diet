import Fuse from "fuse.js";
import type { Food, Nutrition } from "@shared/types/food";

const fuseOptions = {
  keys: [
    { name: "name", weight: 2 },
    { name: "altNames", weight: 1 },
  ],
  threshold: 0.3,
  includeScore: true,
};

export class FoodSearch {
  private fuse: Fuse<Food>;

  constructor(foods: Food[]) {
    this.fuse = new Fuse(foods, fuseOptions);
  }

  search(query: string): Food[] {
    if (!query.trim()) return [];
    return this.fuse.search(query).map((result) => result.item);
  }

  searchByNutrition(query: string, nutrition: Partial<Nutrition>): Food[] {
    const results = this.search(query);
    return results.filter((food) => {
      if (!food.nutrition) return false;
      return Object.entries(nutrition).every(([key, value]) => {
        const foodValue = food.nutrition?.[key as keyof Nutrition];
        return foodValue !== undefined && foodValue <= value;
      });
    });
  }
}
