import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import FavoriteRecipes from "@/components/profile/settings/favorites/FavoriteRecipes";
import { Skeleton } from "@/components/ui/skeleton";
import { graphqlClient } from "@/lib/gql/client";
import { useMyRecipesQuery, useGetRecipePreferencesQuery } from "@/lib/gql/graphql";
import { CACHE_FIRST_QUERY_OPTIONS } from "@/lib/gql/query-config";

const FavoriteRecipesPage = () => {
  const navigate = useNavigate();
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);

  // 使用缓存优先策略，减少卡顿
  const { isLoading: recipesLoading, error: recipesError, data: recipesData } = useMyRecipesQuery(
    graphqlClient,
    {},
    CACHE_FIRST_QUERY_OPTIONS
  );

  const { isLoading: preferencesLoading, error: preferencesError, data: preferencesData } = useGetRecipePreferencesQuery(
    graphqlClient,
    {},
    CACHE_FIRST_QUERY_OPTIONS
  );

  // 优化loading状态：如果缓存中有数据就立即显示，不需要等待loading
  const isLoading = recipesLoading && !recipesData;
  const hasError = recipesError;
  const hasRecipesData = (recipesData && !recipesError) || (!recipesLoading && !recipesError);

  // 调试信息（开发环境）
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('FavoriteRecipesPage Debug:', {
        recipesLoading,
        recipesError: !!recipesError,
        preferencesLoading,
        preferencesError: !!preferencesError,
        hasRecipesData,
        willShowList: hasRecipesData,
        hasCachedData: !!recipesData,
        timestamp: Date.now()
      });
    }
  }, [recipesLoading, recipesError, preferencesLoading, preferencesError, hasRecipesData, recipesData]);

  const handleBack = () => {
    navigate({ to: "/profile" });
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
  };

  return (
    <div className="flex flex-col h-dvh min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-sm font-normal -ml-2"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4" />
          我的菜谱
        </Button>
        
        <Button
          variant={isSelectionMode ? "default" : "outline"}
          size="sm"
          onClick={handleToggleSelectionMode}
          className="text-xs"
        >
          {isSelectionMode ? "退出选择" : "批量操作"}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full px-6 py-6 h-full">
          {isLoading && !recipesData ? (
            // 只在没有缓存数据时显示loading状态
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ) : hasError ? (
            // 显示错误状态，避免无限重试
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-muted-foreground text-2xl">⚠️</span>
              </div>
              <h4 className="text-base font-medium mb-2">加载失败</h4>
              <p className="text-muted-foreground text-center text-sm mb-4">
                网络连接异常，请检查网络后重试
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // 手动重试，但不会无限重试
                  window.location.reload();
                }}
              >
                重新加载
              </Button>
            </div>
          ) : hasRecipesData ? (
            <FavoriteRecipes 
              isSelectionMode={isSelectionMode}
              onToggleSelectionMode={handleToggleSelectionMode}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FavoriteRecipesPage;
