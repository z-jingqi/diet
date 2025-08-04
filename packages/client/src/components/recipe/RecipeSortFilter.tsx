import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star } from "lucide-react";
import { CuisineType, MealType } from "@/lib/gql/graphql";
import { cuisineTypeLabels, mealTypeLabels } from "@/data/recipe-mappings";
import { cn } from "@/lib/utils";

/** 排序选项 */
export enum SortOption {
  Latest = "LATEST",
  Oldest = "OLDEST",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  DifficultyAsc = "DIFFICULTY_ASC",
  DifficultyDesc = "DIFFICULTY_DESC",
  TimeAsc = "TIME_ASC",
  TimeDesc = "TIME_DESC",
  CostAsc = "COST_ASC",
  CostDesc = "COST_DESC",
}

export interface RecipeFilters {
  cuisineType?: CuisineType;
  mealType?: MealType;
  starred?: boolean;
}

interface RecipeSortFilterProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  className?: string;
}

const RecipeSortFilter = ({
  sort,
  onSortChange,
  filters,
  onFiltersChange,
  className,
}: RecipeSortFilterProps) => {
  const handleFilterChange = (key: keyof RecipeFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === "ALL" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const toggleStarredFilter = () => {
    onFiltersChange({
      ...filters,
      starred: !filters.starred,
    });
  };

  const hasActiveFilters =
    filters.cuisineType || filters.mealType || filters.starred;

  return (
    <div className={cn("", className)}>
      {/* Compact single row layout */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {/* Sort selector */}
        <Select
          value={sort}
          onValueChange={(v) => onSortChange(v as SortOption)}
        >
          <SelectTrigger className="h-8 w-auto min-w-24 text-xs border-border/40">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SortOption.Latest}>最新</SelectItem>
            <SelectItem value={SortOption.Oldest}>最早</SelectItem>
            <SelectItem value={SortOption.NameAsc}>名称↑</SelectItem>
            <SelectItem value={SortOption.NameDesc}>名称↓</SelectItem>
            <SelectItem value={SortOption.DifficultyAsc}>难度↑</SelectItem>
            <SelectItem value={SortOption.DifficultyDesc}>难度↓</SelectItem>
            <SelectItem value={SortOption.TimeAsc}>时间↑</SelectItem>
            <SelectItem value={SortOption.TimeDesc}>时间↓</SelectItem>
            <SelectItem value={SortOption.CostAsc}>成本↑</SelectItem>
            <SelectItem value={SortOption.CostDesc}>成本↓</SelectItem>
          </SelectContent>
        </Select>

        {/* Cuisine filter */}
        <Select
          value={filters.cuisineType || "ALL"}
          onValueChange={(v) => handleFilterChange("cuisineType", v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-20 text-xs border-border/40">
            <SelectValue placeholder="菜系" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">菜系</SelectItem>
            {Object.entries(cuisineTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Meal type filter */}
        <Select
          value={filters.mealType || "ALL"}
          onValueChange={(v) => handleFilterChange("mealType", v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-20 text-xs border-border/40">
            <SelectValue placeholder="餐次" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">餐次</SelectItem>
            {Object.entries(mealTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Star filter toggle */}
        <Button
          variant={filters.starred ? "default" : "ghost"}
          size="sm"
          onClick={toggleStarredFilter}
          className="h-8 px-2 text-xs"
        >
          <Star
            className="h-3 w-3"
            fill={filters.starred ? "currentColor" : "none"}
          />
        </Button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeSortFilter;
