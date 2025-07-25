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
import { X } from "lucide-react";
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

  const hasActiveFilters = filters.cuisineType || filters.mealType;

  return (
    <div className={cn("space-y-4", className)}>
      {/* 排序选择 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">排序:</span>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-48 h-9 text-xs sm:text-sm">
            <SelectValue placeholder="选择排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SortOption.Latest}>最新创建</SelectItem>
            <SelectItem value={SortOption.Oldest}>最早创建</SelectItem>
            <SelectItem value={SortOption.NameAsc}>名称 A→Z</SelectItem>
            <SelectItem value={SortOption.NameDesc}>名称 Z→A</SelectItem>
            <SelectItem value={SortOption.DifficultyAsc}>难度 简单→困难</SelectItem>
            <SelectItem value={SortOption.DifficultyDesc}>难度 困难→简单</SelectItem>
            <SelectItem value={SortOption.TimeAsc}>时间 短→长</SelectItem>
            <SelectItem value={SortOption.TimeDesc}>时间 长→短</SelectItem>
            <SelectItem value={SortOption.CostAsc}>预估成本 低→高</SelectItem>
            <SelectItem value={SortOption.CostDesc}>预估成本 高→低</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 筛选选项 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">筛选:</span>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          {/* 菜系筛选 */}
          <Select
            value={filters.cuisineType || "ALL"}
            onValueChange={(v) => handleFilterChange("cuisineType", v)}
          >
            <SelectTrigger className="w-full sm:w-32 h-9 text-xs sm:text-sm">
              <SelectValue placeholder="菜系" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部菜系</SelectItem>
              {Object.entries(cuisineTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 餐次筛选 */}
          <Select
            value={filters.mealType || "ALL"}
            onValueChange={(v) => handleFilterChange("mealType", v)}
          >
            <SelectTrigger className="w-full sm:w-32 h-9 text-xs sm:text-sm">
              <SelectValue placeholder="餐次" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部餐次</SelectItem>
              {Object.entries(mealTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 清除筛选按钮 */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2 text-xs w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-1" />
              清除
            </Button>
          )}
        </div>
      </div>

      {/* 活跃筛选标签 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.cuisineType && (
            <Badge variant="secondary" className="text-xs">
              菜系: {cuisineTypeLabels[filters.cuisineType]}
              <button
                onClick={() => handleFilterChange("cuisineType", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.mealType && (
            <Badge variant="secondary" className="text-xs">
              餐次: {mealTypeLabels[filters.mealType]}
              <button
                onClick={() => handleFilterChange("mealType", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeSortFilter; 