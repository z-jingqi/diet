import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MutedText } from "@/components/ui/typography";
import {
  useMyRecipesQuery,
  useDeleteRecipesMutation,
  useDeleteRecipeMutation,
  useSetRecipePreferenceMutation,
  useRemoveRecipePreferenceMutation,
  useGetRecipePreferencesQuery,
  PreferenceType,
} from "@/lib/gql/graphql";
import { graphqlClient } from "@/lib/gql/client";
import { Skeleton } from "@/components/ui/skeleton";
import RecipeCard from "@/components/recipe/RecipeCard";
import RecipeSortFilter, {
  SortOption,
  RecipeFilters,
} from "@/components/recipe/RecipeSortFilter";
import BatchActionToolbar from "@/components/recipe/BatchActionToolbar";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { Recipe, Difficulty } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useShoppingListToast from "@/hooks/useShoppingListToast";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FavoriteRecipesProps {
  className?: string;
  isSelectionMode?: boolean;
  onToggleSelectionMode?: () => void;
}

const FavoriteRecipes = ({ 
  className, 
  isSelectionMode: externalIsSelectionMode,
  onToggleSelectionMode: externalOnToggleSelectionMode 
}: FavoriteRecipesProps) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [sort, setSort] = React.useState<SortOption>(SortOption.Latest);
  const [filters, setFilters] = React.useState<RecipeFilters>({});
  // Use external selection mode if provided, otherwise use internal state
  const [internalIsSelectionMode, setInternalIsSelectionMode] = React.useState(false);
  const isSelectionMode = externalIsSelectionMode ?? internalIsSelectionMode;
  const setIsSelectionMode = externalOnToggleSelectionMode ? 
    () => externalOnToggleSelectionMode() : 
    setInternalIsSelectionMode;
  const [selectedRecipes, setSelectedRecipes] = React.useState<Set<string>>(
    new Set(),
  );
  const [recipeToDelete, setRecipeToDelete] = React.useState<string | null>(
    null,
  );
  
  // 使用购物清单提示 hook
  useShoppingListToast();

  // 获取收藏菜谱列表
  const { data, isLoading, error, refetch } = useMyRecipesQuery(
    graphqlClient,
    {},
  );

  // 获取菜谱喜好列表
  const { data: preferencesData } = useGetRecipePreferencesQuery(
    graphqlClient,
    {},
  );

  // 创建喜好映射
  const recipePreferences = React.useMemo(() => {
    const map = new Map<string, PreferenceType>();
    if (preferencesData?.myRecipePreferences) {
      preferencesData.myRecipePreferences.forEach((pref) => {
        if (pref.recipeId && pref.preference) {
          map.set(pref.recipeId, pref.preference);
        }
      });
    }
    return map;
  }, [preferencesData]);

  // 批量删除
  const deleteRecipesMutation = useDeleteRecipesMutation(graphqlClient, {
    onSuccess: () => {
      toast.success("选中的菜谱已删除");
      refetch();
      clearSelection();
    },
    onError: (err) => {
      toast.error("删除失败，请稍后再试");
      console.error("批量删除菜谱失败", err);
    },
  });

  // 单个删除
  const deleteRecipeMutation = useDeleteRecipeMutation(graphqlClient, {
    onSuccess: () => {
      toast.success("菜谱已删除");
      refetch();
    },
    onError: (err) => {
      toast.error("删除失败，请稍后再试");
      console.error("删除菜谱失败", err);
    },
  });

  // 设置收藏状态
  const setRecipePreferenceMutation = useSetRecipePreferenceMutation(
    graphqlClient,
    {
      onSuccess: () => {
        // We're now using optimistic updates, so no need to refetch
      },
      onError: (err) => {
        toast.error("设置收藏状态失败");
        console.error("设置菜谱收藏状态失败", err);
        // On error, refetch to restore correct state
        refetch();
      },
    },
  );

  // 移除收藏状态
  const removeRecipePreferenceMutation = useRemoveRecipePreferenceMutation(
    graphqlClient,
    {
      onSuccess: () => {
        // We're now using optimistic updates, so no need to refetch
      },
      onError: (err) => {
        toast.error("取消收藏失败");
        console.error("取消菜谱收藏状态失败", err);
        // On error, refetch to restore correct state
        refetch();
      },
    },
  );

  // 本地状态跟踪星标状态，用于优化UI响应
  const [optimisticStars, setOptimisticStars] = React.useState<
    Map<string, boolean>
  >(new Map());

  // 合并后端数据和本地优化状态
  const effectiveStarredStatus = React.useMemo(() => {
    const result = new Map<string, boolean>();

    // 首先添加后端数据
    if (preferencesData?.myRecipePreferences) {
      preferencesData.myRecipePreferences.forEach((pref) => {
        if (pref.recipeId) {
          result.set(pref.recipeId, pref.preference === PreferenceType.Like);
        }
      });
    }

    // 然后覆盖本地优化状态
    optimisticStars.forEach((isStarred, id) => {
      result.set(id, isStarred);
    });

    return result;
  }, [preferencesData, optimisticStars]);

  const sortedAndFilteredRecipes = React.useMemo(() => {
    if (!data?.myRecipes) return [];

    let list = [...(data.myRecipes ?? [])] as Recipe[];

    // 应用筛选
    if (filters.cuisineType) {
      list = list.filter(
        (recipe) => recipe.cuisineType === filters.cuisineType,
      );
    }
    if (filters.mealType) {
      list = list.filter((recipe) => recipe.mealType === filters.mealType);
    }
    if (filters.starred) {
      list = list.filter(
        (recipe) =>
          recipe.id &&
          (effectiveStarredStatus.get(recipe.id) === true ||
            recipePreferences.get(recipe.id) === PreferenceType.Like),
      );
    }

    // 应用排序
    switch (sort) {
      case SortOption.Latest:
        return list.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
      case SortOption.Oldest:
        return list.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime(),
        );
      case SortOption.NameAsc:
        return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case SortOption.NameDesc:
        return list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      case SortOption.DifficultyAsc:
        return list.sort((a, b) => {
          const difficultyOrder = {
            [Difficulty.Easy]: 1,
            [Difficulty.Medium]: 2,
            [Difficulty.Hard]: 3,
          };
          return (
            (difficultyOrder[a.difficulty || Difficulty.Easy] || 0) -
            (difficultyOrder[b.difficulty || Difficulty.Easy] || 0)
          );
        });
      case SortOption.DifficultyDesc:
        return list.sort((a, b) => {
          const difficultyOrder = {
            [Difficulty.Easy]: 1,
            [Difficulty.Medium]: 2,
            [Difficulty.Hard]: 3,
          };
          return (
            (difficultyOrder[b.difficulty || Difficulty.Easy] || 0) -
            (difficultyOrder[a.difficulty || Difficulty.Easy] || 0)
          );
        });
      case SortOption.TimeAsc:
        return list.sort(
          (a, b) => (a.totalTimeApproxMin || 0) - (b.totalTimeApproxMin || 0),
        );
      case SortOption.TimeDesc:
        return list.sort(
          (a, b) => (b.totalTimeApproxMin || 0) - (a.totalTimeApproxMin || 0),
        );
      case SortOption.CostAsc:
        return list.sort((a, b) => (a.costApprox || 0) - (b.costApprox || 0));
      case SortOption.CostDesc:
        return list.sort((a, b) => (b.costApprox || 0) - (a.costApprox || 0));
      default:
        return list;
    }
  }, [
    data?.myRecipes,
    sort,
    filters,
    recipePreferences,
    effectiveStarredStatus,
  ]);

  // 过滤掉空值，避免在渲染时出现 null
  const visibleRecipes = React.useMemo<Recipe[]>(() => {
    return sortedAndFilteredRecipes.filter((rec): rec is Recipe =>
      Boolean(rec),
    );
  }, [sortedAndFilteredRecipes]);

  const onCardClick = (id: string) => {
    if (!isSelectionMode) {
      if (isMobile) {
        // Mobile: Navigate from FavoriteRecipesPage
        navigate({
          to: "/recipe/$id",
          params: { id },
          search: {
            from: "favorite-recipes",
          },
        });
      } else {
        // Desktop: Navigate from profile settings panel
        navigate({
          to: "/recipe/$id",
          params: { id },
          search: {
            from: "settings",
            settingsGroup: "favorites",
            settingsView: "recipes",
          },
        });
      }
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
        .map((recipe) => recipe.id)
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
    if (externalOnToggleSelectionMode) {
      externalOnToggleSelectionMode();
    } else {
      setInternalIsSelectionMode(!isSelectionMode);
    }
  };

  const handleBatchDelete = () => {
    const ids = Array.from(selectedRecipes);
    if (ids.length === 0) {
      toast.info("请先选择要删除的菜谱");
      return;
    }

    deleteRecipesMutation.mutate({ ids });
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipeToDelete(id);
  };

  const confirmDeleteRecipe = () => {
    if (recipeToDelete) {
      deleteRecipeMutation.mutate({ id: recipeToDelete });
      setRecipeToDelete(null);
    }
  };

  const handleStarRecipe = (id: string, isStarred: boolean) => {
    const recipe = visibleRecipes.find((r) => r.id === id);
    if (!recipe || !recipe.name) return;

    // 立即更新本地状态，实现乐观更新
    setOptimisticStars((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, isStarred);
      return newMap;
    });

    // 发送到服务器
    if (isStarred) {
      // 收藏菜谱
      setRecipePreferenceMutation.mutate({
        input: {
          recipeId: id,
          recipeName: recipe.name,
          preference: PreferenceType.Like,
        },
      });
    } else {
      // 取消收藏
      removeRecipePreferenceMutation.mutate({
        recipeId: id,
      });
    }
  };

  const handleGenerateShoppingList = () => {
    if (selectedRecipes.size === 0) {
      return;
    }

    // 将选中的菜谱 ID 通过查询参数传递到购物清单页面
    const idsParam = Array.from(selectedRecipes).join(",");

    navigate({
      to: "/shopping-list",
      search: { ids: idsParam },
    });
  };

  return (
    <>
      <Card className={cn("border", className)}>
        <CardHeader>
          <RecipeSortFilter
            sort={sort}
            onSortChange={setSort}
            filters={filters}
            onFiltersChange={setFilters}
          />
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
              <MutedText className="text-center">
                加载失败，请稍后再试。
              </MutedText>
            </div>
          )}
          {!isLoading && !error && visibleRecipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-muted-foreground text-2xl">📝</span>
              </div>
              <h4 className="text-base font-medium mb-2">
                {Object.keys(filters).length > 0
                  ? "没有符合条件的菜谱"
                  : "还没有收藏的菜谱"}
              </h4>
              <MutedText className="text-center text-sm">
                {Object.keys(filters).length > 0
                  ? "尝试调整筛选条件或清除筛选。"
                  : "浏览菜谱时点击收藏按钮，收藏的菜谱会显示在这里。"}
              </MutedText>
            </div>
          )}
          {!isLoading && visibleRecipes.length > 0 && (
            <div className="space-y-1">
              {visibleRecipes.map((rec) => (
                <RecipeCard
                  key={`${rec.id ?? `recipe-${rec.name}`}`}
                  recipe={rec}
                  onClick={onCardClick}
                  isSelected={selectedRecipes.has(rec.id || "")}
                  onSelectionChange={handleSelectionChange}
                  selectable={isSelectionMode}
                  onDelete={!isSelectionMode ? handleDeleteRecipe : undefined}
                  onStar={!isSelectionMode ? handleStarRecipe : undefined}
                  isStarred={
                    !!rec.id && effectiveStarredStatus.get(rec.id) === true
                  }
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
        isDeleting={deleteRecipesMutation.isPending}
      />

      {/* 删除确认对话框 */}
      <AlertDialog
        open={!!recipeToDelete}
        onOpenChange={(open) => !open && setRecipeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除
              {recipeToDelete
                ? `「${visibleRecipes.find((r) => r.id === recipeToDelete)?.name || ""}」`
                : "这个"}
              菜谱吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRecipe}
              disabled={deleteRecipeMutation.isPending}
            >
              {deleteRecipeMutation.isPending ? "删除中..." : "删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FavoriteRecipes;
