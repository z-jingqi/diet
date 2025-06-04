export type FoodCategory = 'vegetable' | 'fruit' | 'meat' | 'seafood' | 'beverage' | 'grain' | 'dairy' | 'other';
export type AllowedStatus = 'yes' | 'no' | 'limited';

export interface Nutrition {
  protein?: number;      // g/100g
  potassium?: number;    // mg/100g
  phosphorus?: number;   // mg/100g
  sodium?: number;       // mg/100g
  calories?: number;     // kcal/100g
}

export interface Season {
  spring?: boolean;
  summer?: boolean;
  autumn?: boolean;
  winter?: boolean;
}

export interface Storage {
  method: string;
  duration: string;
}

export interface Cooking {
  methods: string[];
  tips?: string;
}

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  allowed: AllowedStatus;
  reason?: string;
  altNames?: string[];
  nutrition?: Nutrition;
  season?: Season;
  storage?: Storage;
  cooking?: Cooking;
} 
