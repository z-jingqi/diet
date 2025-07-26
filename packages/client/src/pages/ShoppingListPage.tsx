import React from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/gql/client";
import { GetRecipeDocument, Recipe } from "@/lib/gql/graphql";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Sparkles, CheckSquare, Square } from "lucide-react";
import { useGenerateShoppingList, ShoppingItem } from "@/hooks/recipe/useGenerateShoppingList";

const ShoppingListPage = () => {
  // 解析查询参数中的菜谱 ID
  // @ts-ignore - 路由文件在同 PR 中新增，生成类型后将自动消失
  const search = useSearch({ from: "/shopping-list" });
  const ids = (search as any).ids ?? "";
  const navigate = useNavigate();

  const idList = React.useMemo(() => {
    return ids ? ids.split(",").filter(Boolean) : [];
  }, [ids]);

  // 并行获取所有菜谱详情
  const recipeQueries = useQueries({
    queries: idList.map((id: string) => ({
      queryKey: ["recipe", id],
      // @ts-ignore
      queryFn: async () => {
        const result: any = await graphqlClient.request(GetRecipeDocument, { id });
        return result.recipe as Recipe;
      },
      enabled: !!id,
    })),
  }) as any;

  // @ts-ignore
  const isLoading = recipeQueries.some((q: any) => q.isLoading);
  // @ts-ignore
  const recipes: Recipe[] = recipeQueries
    .map((q: any) => q.data)
    .filter(Boolean) as Recipe[];

  // 本地存储购物清单
  const [shoppingList, setShoppingList] = React.useState<ShoppingItem[]>(() => {
    const stored = localStorage.getItem("shoppingListData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.items)) {
          return parsed.items as ShoppingItem[];
        }
      } catch (e) {
        console.error("解析本地购物清单失败", e);
      }
    }
    return [];
  });

  // 使用新 hook
  const { buildLocalList, optimizeListWithAI, generating } = useGenerateShoppingList(recipes);

  // 首次加载且本地无数据时生成购物清单
  React.useEffect(() => {
    if (recipes.length > 0 && shoppingList.length === 0) {
      const base = buildLocalList();
      setShoppingList(base);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes]);

  // 持久化到 localStorage
  React.useEffect(() => {
    if (shoppingList.length > 0) {
      const dataToSave = {
        recipeIds: idList,
        items: shoppingList,
      };
      localStorage.setItem("shoppingListData", JSON.stringify(dataToSave));
    } else {
      localStorage.removeItem("shoppingListData");
    }
  }, [shoppingList, idList]);

  // 切换已购买状态
  const togglePurchased = (index: number) => {
    setShoppingList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        purchased: !updated[index].purchased,
      };
      // 排序：未购买在前
      updated.sort((a, b) => Number(!!a.purchased) - Number(!!b.purchased));
      return updated;
    });
  };

  // 调用 AI 优化购物清单
  const [optimizing, setOptimizing] = React.useState(false);
  const handleRegenerate = async () => {
    if (optimizing || recipes.length === 0) {
      return;
    }
    setOptimizing(true);
    const optimized = await optimizeListWithAI(shoppingList);
    if (optimized) {
      setShoppingList(optimized);
    }
    setOptimizing(false);
  };

  // 渲染购物清单条目
  const renderList = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      );
    }

    if (shoppingList.length === 0) {
      return (
        <div className="text-muted-foreground text-center py-8">暂无购物清单</div>
      );
    }

    return (
      <ul className="space-y-1">
        {shoppingList.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border-b border-dashed border-muted-foreground/30 py-2 last:border-0"
          >
            <div className="flex items-center gap-2 flex-1" onClick={() => togglePurchased(idx)}>
              {item.purchased ? (
                <CheckSquare className="w-4 h-4 text-primary" />
              ) : (
                <Square className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={item.purchased ? "line-through text-muted-foreground" : "font-medium"}>
                {item.name}
              </span>
            </div>
            <span className="text-muted-foreground text-sm">
              {item.quantity} {item.unit ?? ""}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container max-w-lg mx-auto py-6 px-4 flex flex-col h-full">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            window.history.back();
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={optimizing || generating || recipes.length === 0}
        >
          <Sparkles className="w-4 h-4 mr-1" />
          {optimizing ? "AI 优化中..." : "AI 优化"}
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto pr-2">
        {renderList()}
      </ScrollArea>
    </div>
  );
};

export default ShoppingListPage; 