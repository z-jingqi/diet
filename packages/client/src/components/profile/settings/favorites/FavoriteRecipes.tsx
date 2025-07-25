import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MutedText } from "@/components/ui/typography";
import { useMyRecipesQuery } from "@/lib/gql/graphql";
import { graphqlClient } from "@/lib/gql/client";
import { Skeleton } from "@/components/ui/skeleton";
import RecipeCard from "@/components/recipe/RecipeCard";
import RecipeSortFilter, { SortOption, RecipeFilters } from "@/components/recipe/RecipeSortFilter";
import BatchActionToolbar from "@/components/recipe/BatchActionToolbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { Recipe, CuisineType, MealType, Difficulty } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";

interface FavoriteRecipesProps {
  className?: string;
}

const FavoriteRecipes = ({ className }: FavoriteRecipesProps) => {
  const navigate = useNavigate();
  const [sort, setSort] = React.useState<SortOption>(SortOption.Latest);
  const [filters, setFilters] = React.useState<RecipeFilters>({});
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);
  const [selectedRecipes, setSelectedRecipes] = React.useState<Set<string>>(new Set());

  // 获取收藏菜谱列表
  const { data, isLoading, error } = useMyRecipesQuery(graphqlClient, {});

  const sortedAndFilteredRecipes = React.useMemo(() => {
    if (!data?.myRecipes) return [];

    let list = [...(data.myRecipes ?? [])] as Recipe[];

    // 应用筛选
    if (filters.cuisineType) {
      list = list.filter(recipe => recipe.cuisineType === filters.cuisineType);
    }
    if (filters.mealType) {
      list = list.filter(recipe => recipe.mealType === filters.mealType);
    }

    // 应用排序
    switch (sort) {
      case SortOption.Latest:
        return list.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
      case SortOption.Oldest:
        return list.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );
      case SortOption.NameAsc:
        return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case SortOption.NameDesc:
        return list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      case SortOption.DifficultyAsc:
        return list.sort((a, b) => {
          const difficultyOrder = { [Difficulty.Easy]: 1, [Difficulty.Medium]: 2, [Difficulty.Hard]: 3 };
          return (difficultyOrder[a.difficulty || Difficulty.Easy] || 0) - (difficultyOrder[b.difficulty || Difficulty.Easy] || 0);
        });
      case SortOption.DifficultyDesc:
        return list.sort((a, b) => {
          const difficultyOrder = { [Difficulty.Easy]: 1, [Difficulty.Medium]: 2, [Difficulty.Hard]: 3 };
          return (difficultyOrder[b.difficulty || Difficulty.Easy] || 0) - (difficultyOrder[a.difficulty || Difficulty.Easy] || 0);
        });
      case SortOption.TimeAsc:
        return list.sort((a, b) => (a.totalTimeApproxMin || 0) - (b.totalTimeApproxMin || 0));
      case SortOption.TimeDesc:
        return list.sort((a, b) => (b.totalTimeApproxMin || 0) - (a.totalTimeApproxMin || 0));
      case SortOption.CostAsc:
        return list.sort((a, b) => (a.costApprox || 0) - (b.costApprox || 0));
      case SortOption.CostDesc:
        return list.sort((a, b) => (b.costApprox || 0) - (a.costApprox || 0));
      default:
        return list;
    }
  }, [data?.myRecipes, sort, filters]);

  // 过滤掉空值，避免在渲染时出现 null
  const visibleRecipes = React.useMemo<Recipe[]>(() => {
    return sortedAndFilteredRecipes.filter((rec): rec is Recipe => Boolean(rec));
  }, [sortedAndFilteredRecipes]);

  const onCardClick = (id: string) => {
    if (!isSelectionMode) {
      navigate({ 
        to: "/recipe/$id", 
        params: { id },
        search: { 
          from: 'settings',
          settingsGroup: 'favorites',
          settingsView: 'recipes'
        }
      });
    }
  };

  const handleSelectionChange = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedRecipes);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRecipes(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRecipes.size === visibleRecipes.length) {
      setSelectedRecipes(new Set());
    } else {
      const validIds = visibleRecipes
        .map(recipe => recipe.id)
        .filter((id): id is string => Boolean(id));
      setSelectedRecipes(new Set(validIds));
    }
  };

  const clearSelection = () => {
    setSelectedRecipes(new Set());
    setIsSelectionMode(false);
  };

  const handleToggleSelectionMode = () => {
    if (isSelectionMode) {
      // 退出选择模式时，清空选中状态
      setSelectedRecipes(new Set());
    }
    setIsSelectionMode(!isSelectionMode);
  };

  const handleBatchDelete = () => {
    // TODO: 实现批量删除功能
    console.log("批量删除:", Array.from(selectedRecipes));
  };

  const handleGenerateShoppingList = () => {
    // TODO: 实现生成购物清单功能
    console.log("生成购物清单:", Array.from(selectedRecipes));
  };

  return (
    <>
      <Card className={cn("border", className)}>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <RecipeSortFilter
                  sort={sort}
                  onSortChange={setSort}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
              
              {/* 批量选择按钮 */}
              <Button
                variant={isSelectionMode ? "default" : "outline"}
                size="sm"
                onClick={handleToggleSelectionMode}
                className="h-9 w-full sm:w-auto"
              >
                {isSelectionMode ? (
                  <>
                    <span className="hidden sm:inline">退出选择</span>
                    <span className="sm:hidden">退出</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">批量操作</span>
                    <span className="sm:hidden">批量操作</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          )}
          {!!error && (
            <div className="flex flex-col items-center justify-center py-8">
              <MutedText className="text-center">加载失败，请稍后再试。</MutedText>
            </div>
          )}
          {!isLoading && !error && visibleRecipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-muted-foreground text-2xl">📝</span>
              </div>
              <h4 className="text-base font-medium mb-2">
                {Object.keys(filters).length > 0 ? "没有符合条件的菜谱" : "还没有收藏的菜谱"}
              </h4>
              <MutedText className="text-center text-sm">
                {Object.keys(filters).length > 0 
                  ? "尝试调整筛选条件或清除筛选。"
                  : "浏览菜谱时点击收藏按钮，收藏的菜谱会显示在这里。"
                }
              </MutedText>
            </div>
          )}
          {!isLoading && visibleRecipes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleRecipes.map((rec) => (
                <RecipeCard
                  key={`${rec.id ?? `recipe-${rec.name}`}`}
                  recipe={rec}
                  onClick={onCardClick}
                  isSelected={selectedRecipes.has(rec.id || "")}
                  onSelectionChange={handleSelectionChange}
                  selectable={isSelectionMode}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 批量操作工具栏 */}
      <BatchActionToolbar
        selectedCount={selectedRecipes.size}
        totalCount={visibleRecipes.length}
        isSelectionMode={isSelectionMode}
        onClearSelection={clearSelection}
        onSelectAll={handleSelectAll}
        onDelete={handleBatchDelete}
        onGenerateShoppingList={handleGenerateShoppingList}
      />
    </>
  );
};

export default FavoriteRecipes;
