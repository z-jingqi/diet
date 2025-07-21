import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MutedText } from "@/components/ui/typography";
import { useMyRecipesQuery } from "@/lib/gql/graphql";
import { graphqlClient } from "@/lib/gql/client";
import { Skeleton } from "@/components/ui/skeleton";
import RecipeCard from "@/components/recipe/RecipeCard";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Recipe } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";

interface FavoriteRecipesProps {
  className?: string;
}

/** 排序选项 */
enum SortOption {
  Latest = "LATEST",
  Oldest = "OLDEST",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
}

const FavoriteRecipes = ({ className }: FavoriteRecipesProps) => {
  const navigate = useNavigate();
  const [sort, setSort] = React.useState<SortOption>(SortOption.Latest);

  // 获取收藏菜谱列表
  const { data, isLoading, error } = useMyRecipesQuery(graphqlClient, {});

  const sortedRecipes = React.useMemo(() => {
    if (!data?.myRecipes) return [];

    const list = [...(data.myRecipes ?? [])] as Recipe[];
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
      default:
        return list;
    }
  }, [data?.myRecipes, sort]);

  // 过滤掉空值，避免在渲染时出现 null
  const visibleRecipes = React.useMemo<Recipe[]>(() => {
    return sortedRecipes.filter((rec): rec is Recipe => Boolean(rec));
  }, [sortedRecipes]);

  const onCardClick = (id: string) => {
    navigate({ 
      to: "/recipe/$id", 
      params: { id },
      search: { 
        from: 'settings',
        settingsGroup: 'favorites',
        settingsView: 'recipes'
      }
    });
  };

  return (
    <Card className={cn("border", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">我的收藏</h3>
            <MutedText className="text-sm">
              {visibleRecipes.length} 个菜谱
            </MutedText>
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="排序" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortOption.Latest}>最新</SelectItem>
              <SelectItem value={SortOption.Oldest}>最旧</SelectItem>
              <SelectItem value={SortOption.NameAsc}>名称 A→Z</SelectItem>
              <SelectItem value={SortOption.NameDesc}>名称 Z→A</SelectItem>
            </SelectContent>
          </Select>
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
        {!isLoading && !error && sortedRecipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-muted-foreground text-2xl">📝</span>
            </div>
            <h4 className="text-base font-medium mb-2">还没有收藏的菜谱</h4>
            <MutedText className="text-center text-sm">
              浏览菜谱时点击收藏按钮，收藏的菜谱会显示在这里。
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
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteRecipes;
