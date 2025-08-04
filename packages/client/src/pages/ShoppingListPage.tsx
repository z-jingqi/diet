import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useRecipesByIdsQuery } from "@/lib/gql/graphql";
import { graphqlClient } from "@/lib/gql/client";
import { Recipe } from "@/lib/gql/graphql";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Sparkles, CheckSquare, Square } from "lucide-react";
import {
  useGenerateShoppingList,
  ShoppingItem,
} from "@/hooks/recipe/useGenerateShoppingList";
import { motion, AnimatePresence } from "framer-motion";

const ShoppingListPage = () => {
  // 解析查询参数中的菜谱 ID
  const search = useSearch({ from: "/shopping-list" });
  const ids = (search as any).ids ?? "";

  const idList = React.useMemo(() => {
    return ids ? ids.split(",").filter(Boolean) : [];
  }, [ids]);

  // 并行获取所有菜谱详情
  const { data, isLoading } = useRecipesByIdsQuery(
    graphqlClient,
    { ids: idList },
    { enabled: idList.length > 0 }
  );

  const recipes = React.useMemo(() => {
    return (data?.recipesByIds?.filter(Boolean) as Recipe[]) ?? [];
  }, [data]);

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
  const { buildLocalList, optimizeListWithAI, generating } =
    useGenerateShoppingList(recipes);

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
        <div className="text-muted-foreground text-center py-8">
          暂无购物清单
        </div>
      );
    }

    return (
      <motion.ul 
        className="space-y-1"
        layout
      >
        <AnimatePresence mode="popLayout">
          {shoppingList.map((item, idx) => (
            <motion.li
              key={`${item.name}-${item.quantity}-${item.unit}`}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  opacity: { duration: 0.2 }
                }
              }}
              exit={{ 
                opacity: 0, 
                x: -100, 
                transition: { 
                  duration: 0.2,
                  ease: "easeIn"
                } 
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex justify-between items-center border-b border-dashed border-muted-foreground/30 py-2 last:border-0"
            >
              <motion.div
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={() => togglePurchased(idx)}
                layout
              >
                <motion.div
                  animate={{ 
                    scale: item.purchased ? [1, 1.2, 1] : 1,
                    color: item.purchased ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {item.purchased ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </motion.div>
                <motion.span
                  animate={{
                    opacity: item.purchased ? 0.6 : 1,
                    textDecoration: item.purchased ? "line-through" : "none"
                  }}
                  transition={{ duration: 0.2 }}
                  className={item.purchased ? "text-muted-foreground" : "font-medium"}
                >
                  {item.name}
                </motion.span>
              </motion.div>
              <motion.span 
                className="text-muted-foreground text-sm"
                animate={{
                  opacity: item.purchased ? 0.5 : 0.7
                }}
                transition={{ duration: 0.2 }}
              >
                {item.quantity} {item.unit ?? ""}
              </motion.span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    );
  };

  return (
    <div className="flex flex-col h-dvh min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-sm font-normal -ml-2"
          onClick={() => {
            window.history.back();
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          购物清单
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={optimizing || generating || recipes.length === 0}
          className="text-xs"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {optimizing ? "AI 优化中..." : "AI 优化"}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-2xl mx-auto w-full px-6 py-6 h-full">
          <ScrollArea className="h-full">
            {renderList()}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListPage;
